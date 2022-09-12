import { Anchor, Center, Container, Footer as MFooter, Group, Stack, Text } from "@mantine/core";
import { signIn, useSession } from "next-auth/react";
import React, { FC, useEffect, useState } from "react";

export const Footer: FC<{}> = () => {
  const { data: session } = useSession();

  return (
    <MFooter mt={"2vh"} mx={"1vw"} height={"10vh"} style={{ position: "relative" }}>
      <Center pt="sm">
        <Stack spacing="xs" align={"center"}>
          {session ? (
            <Group>
              <Anchor href="/">
                <Text size={"sm"}>Home</Text>
              </Anchor>
              <Anchor href="/admin">
                <Text size={"sm"}>Admin</Text>
              </Anchor>
            </Group>
          ) : (
            <Text
              size={"sm"}
              onClick={() => {
                signIn("dropbox");
              }}
            >
              <Anchor>Log In</Anchor>
            </Text>
          )}
          <Text size={"sm"}>
            Built by&nbsp;
            <Anchor href="https://github.com/NuttyShrimp/scougi-library" target="_blank">
              Jan Lecoutere
            </Anchor>
          </Text>
        </Stack>
      </Center>
    </MFooter>
  );
};
