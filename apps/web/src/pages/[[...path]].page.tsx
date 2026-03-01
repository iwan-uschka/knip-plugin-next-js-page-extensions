import Head from "next/head";

export const getServerSideProps = async () => {
  return {
    props: {
      pageData: {
        someKey: "someValue",
      },
    },
  };
};

export default function CatchAllPage() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" key="robots" />
      </Head>
    </>
  );
}
