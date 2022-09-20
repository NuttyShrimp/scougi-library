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

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <div data-theme="scouts">
        <Head>
          <title>Scougi - Scouts en Gidsen Asse</title>
          <meta name="description" content="Verzameling van alle beschibare scougis van Scouts en Gidsen Asse" />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
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
