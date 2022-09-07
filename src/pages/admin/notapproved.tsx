import { Center, Stack, Text, Title } from "@mantine/core";
import { NextPage } from "next";
import { useSession } from "next-auth/react";

const NotApproved: NextPage = () => {
  const {data: session} = useSession();

  return (
    <Center>
      <Stack spacing={2}>
        <Title>Not approved</Title>
        <Text>You need approval from an already approved account to access the admin page</Text>
        <Text><span>AccountId: {session?.user?.id ?? "loading..."} | Username: {session?.user?.name ?? "loading..."}</span></Text>
      </Stack>
    </Center>
  )
}

export default NotApproved;
