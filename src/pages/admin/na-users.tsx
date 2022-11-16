import { GetServerSideProps, NextPage } from "next";
import React, { FC } from "react";
import { makeSerializable } from "../../lib/util";
import { prisma } from "../../lib/prisma";
import { Button, Container, Table, Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { UserList } from "src/components/UserList";

const UserEntry: FC<{ user: DB.User }> = ({ user }) => {
  const confirmModal = () => openConfirmModal({
    title: `Confirm approval of ${user.name}`,
    children: (
      <Text size="sm">
        This action can be reverted by revoking the user in the userslist
      </Text>
    ),
    labels: { confirm: "Confirm", cancel: "Cancel" },
    onConfirm: async () => {
      try {
        const res = await fetch("/api/users/approve", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user.id,
          }),
        });
        showNotification(res.ok ? {
          title: `${user.name} successfully approved`,
          message: "You can revoke the user via the users list",
          color: "green",
          icon: <FontAwesomeIcon icon={faCircleCheck} />,
        } : {
          title: `Failed to approve ${user.name} access`,
          message: "Try again later, The issue is probably already reported",
          color: "red",
          icon: <FontAwesomeIcon icon={faXmarkCircle} />,
        });
      } catch (e) {
        showNotification({
          title: `Failed to approve ${user.name} access`,
          message: "Try again later, The issue is probably already reported",
          color: "red",
          icon: <FontAwesomeIcon icon={faXmarkCircle} />,
        });
        console.error(e);
      }
    },
  });
  return (
    <tr key={user.id}>
      <td>{user.id.slice(0, 7)}{user.id.slice(7).replaceAll(/./g, "*")}</td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td><Button color={"green"} onClick={confirmModal}>Approve</Button></td>
    </tr>
  );
};

const NotApprovedUserList: NextPage = () => <UserList entry={UserEntry} approved={false} />

export default NotApprovedUserList;
