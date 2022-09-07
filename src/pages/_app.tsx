import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { MantineProvider } from '@mantine/core'
import { theme } from '../lib/theme'
import { Footer } from '../components/Footer'
import { SessionProvider } from 'next-auth/react'
import { RouteGuard } from '../components/RouteGuard'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <div data-theme="scouts">
        <Head>
          <title>Scoug - Scouts en Gidsen Asse</title>
        </Head>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={theme}
        >
          <RouteGuard>
            <Component {...pageProps} />
          </RouteGuard>
          <Footer />
        </MantineProvider>
      </div>
    </SessionProvider>
  )
}

export default MyApp
