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
import Script from "next/script";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <div data-theme="scouts">
        <Head>
          <title>Scougi - Scouts en Gidsen Asse</title>
          <meta name="description" content="Verzameling van alle beschibare scougis van Scouts en Gidsen Asse"/>
        </Head>
        <Script data-domain="scougi-library.vercel.app" src="https://plausible.nuttyshrimp.me/js/plausible.js" />
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
          <ModalsProvider>
            <NotificationsProvider>
              <PageContextProvider>
                <AppShell
                  navbar={<AdminNavbar />}
                  styles={() => ({
                    main: {
                      height: "min-content",
                      minHeight: "unset",
                    },
                  })}
                >
                  <div style={{ minHeight: "100vh" }}>
                    <RouteGuard>
                      <Component {...pageProps} />
                    </RouteGuard>
                  </div>
                  <Footer />
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
