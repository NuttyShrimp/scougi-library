import { GetServerSideProps, NextPage } from "next";
import React, { FC } from "react";
import { makeSerializable } from "../../lib/util";
import { prisma } from "../../lib/prisma";
import { Button, Container, Table, Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";

declare interface UserListProps {
  users: DB.User[];
}

// TODO: Remove duplicated code shared with approved user list

const UserEntry: FC<{ user: DB.User }> = ({ user }) => {
  const confirmModal = () => openConfirmModal({
    title: `Confirm approval of ${ user.name }`,
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
          title: `${ user.name } successfully approved`,
          message: "You can revoke the user via the users list",
          color: "green",
          icon: <FontAwesomeIcon icon={ faCircleCheck } />,
        } : {
          title: `Failed to approve ${ user.name } access`,
          message: "Try again later, The issue is probably already reported",
          color: "red",
          icon: <FontAwesomeIcon icon={ faXmarkCircle } />,
        });
      } catch (e) {
        showNotification({
          title: `Failed to approve ${ user.name } access`,
          message: "Try again later, The issue is probably already reported",
          color: "red",
          icon: <FontAwesomeIcon icon={ faXmarkCircle } />,
        });
        console.error(e);
      }
    },
  });
  return (
    <tr key={ user.id }>
      <td>{ user.id.slice(0, 7) }{ user.id.slice(7).replaceAll(/./g, "*") }</td>
      <td>{ user.name }</td>
      <td>{ user.email }</td>
      <td><Button color={ "green" } onClick={ confirmModal }>Approve</Button></td>
    </tr>
  );
};

const NotApprovedUserList: NextPage<UserListProps> = ({ users }) => {
  return (
    <Container>
      <Table>
        <thead>
        <tr>
          <th>Account Id</th>
          <th>Username</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        { users.map(u => <UserEntry user={ u } key={ u.id } />) }
        </tbody>
      </Table>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const users = await prisma.user.findMany({
    where: { approved: false },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  return {
    props: {
      users: makeSerializable(users),
    },
  };
};


export default NotApprovedUserList;
