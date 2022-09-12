import React, { FC, PropsWithChildren, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Center } from "@mantine/core";

export const RouteGuard: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { data: session, status } = useSession();
  const loading = useMemo(() => status === "loading", [ status ]);
  const hasUser = !!session?.user;
  const router = useRouter();

  useEffect(() => {
    if (!router.pathname.startsWith("/admin")) return;
    if (!loading && !hasUser) {
      router.push("/login");
    }
    if (!loading && !session?.user?.approved && !router.pathname.startsWith("/admin/notapproved")) {
      router.push("/admin/notapproved");
    }
  }, [ loading, hasUser, session ]);

  if (!router.pathname.startsWith("/admin") || router.pathname === "/admin/notapproved") {
    return <>{ children }</>;
  }

  if (loading || !hasUser) {
    return (<Center>Waiting for session...</Center>);
  }
  return (<>{ children }</>);
};
