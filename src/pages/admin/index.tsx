import { Text, Title } from "@mantine/core";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import React from "react";

const Admin: NextPage = () => {
  const {data: session} = useSession();

  return (
    <div>
      <Title order={2}>Admin</Title>
    </div>
  )
}

export default Admin;
