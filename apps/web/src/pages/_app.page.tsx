import Head from "next/head";

const CustomApp = (props) => {
  const { pageProps } = props;

  return (
    <>
      <Head>
        <meta name="locale" content="en" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <pre>{JSON.stringify(pageProps, undefined, 2)}</pre>
    </>
  );
};

export default CustomApp;
