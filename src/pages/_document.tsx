import { createGetInitialProps } from '@mantine/next';
import { NextPage } from 'next';
import { Html, Head, Main, NextScript } from 'next/document'

const getInitialProps = createGetInitialProps();

const Document: NextPage<{}> = () => {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

Document.getInitialProps = getInitialProps;

export default Document
