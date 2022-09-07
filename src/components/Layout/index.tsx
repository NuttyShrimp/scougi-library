import { AppShell } from "@mantine/core";
import React, { FC, PropsWithChildren } from "react";
import { AdminNavbar } from "../AdminNavbar";

export const Layout: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <AppShell navbar={<AdminNavbar />}>
      {children}
    </AppShell>
  )
}
