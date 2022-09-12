import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { AppShell, MantineProvider } from "@mantine/core";
import { theme } from "../lib/theme";
import { Footer } from "../components/Footer";
import { SessionProvider } from "next-auth/react";
import { RouteGuard } from "../components/RouteGuard";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { AdminNavbar } from "../components/AdminNavbar";
import { PageContextProvider } from "../lib/pageContext";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <div data-theme="scouts">
        <Head>
          <title>Scoug - Scouts en Gidsen Asse</title>
        </Head>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
          <ModalsProvider>
            <NotificationsProvider>
              <PageContextProvider>
                <AppShell footer={<Footer />} navbar={<AdminNavbar />}>
                  <RouteGuard>
                    <Component {...pageProps} />
                  </RouteGuard>
                </AppShell>
              </PageContextProvider>
            </NotificationsProvider>
          </ModalsProvider>
        </MantineProvider>
      </div>
    </SessionProvider>
  );
}

export default MyApp;
