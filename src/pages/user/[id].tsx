import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { PageLayout } from "~/components/Layout";
import { FAQSkeleton } from "~/components/Loading";
import { FAQCard } from "~/components/faq";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/utils/ssg";

const ProfilePage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.user.getByID.useQuery({
    userId: id,
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${data.name ?? data.id}'s FAQs`}</title>
      </Head>
      <PageLayout>
        <UserFAQs userId={data.id} />
      </PageLayout>
    </>
  );
};

const UserFAQs = (props: { userId: string }) => {
  const { data, isLoading } = api.faq.getAllByUser.useQuery({
    userId: props.userId,
  });

  if (isLoading)
    return (
      <>
        <FAQSkeleton count={4} />
      </>
    );

  if (!data || data.length === 0) return <div>User has not posted</div>;

  return (
    <div className="flex flex-col gap-2">
      {data.map((faq) => (
        <FAQCard faq={faq} key={faq.id} />
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;
  console.log(context.params);
  // console.log(id);

  if (typeof id !== "string") throw new Error("no id");

  await ssg.user.getByID.prefetch({ userId: id });

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

export default ProfilePage;
