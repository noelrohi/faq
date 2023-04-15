import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/Layout";
import { generateSSGHelper } from "~/utils/ssg";
import { FAQCard } from "~/components/faq";

const SingleFAQPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.faq.getById.useQuery({
    id,
  });
  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${data.question} - @${data.user.name ?? ''}`}</title>
      </Head>
      <PageLayout>
        <FAQCard faq={data} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.faq.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SingleFAQPage;