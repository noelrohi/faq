import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";

import { PageLayout } from "~/components/Layout";
import { LoadingSpinner } from "~/components/Loading";
import { UserAvatar } from "~/components/UserAvatar";
import { FAQCard, FAQForm } from "~/components/faq";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/ui/dialog";
import { Input } from "~/ui/input";
import { api } from "~/utils/api";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Separator } from "~/ui/separator";

const FAQPage: NextPage = () => {
  api.faq.getAll.useQuery();
  const { data } = useSession();
  return (
    <>
      <Head>
        <title>FAQ</title>
        <meta name="description" content="Frequently Asked Questions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex w-full flex-1 flex-row rounded-md bg-white/10 p-4 shadow-md lg:w-1/3 ">
              <UserAvatar
                src={data?.user.image ?? ""}
                username={data?.user.name?.substring(0, 2) ?? ""}
              />
              <Input
                value="✍🏻 What is my tech stack?"
                className="border-none text-xl opacity-50"
              />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Post a FAQ</DialogTitle>
            <DialogDescription>
              FAQ stands for Frequently Asked Question
            </DialogDescription>
            <FAQForm />
          </DialogContent>
        </Dialog>
        <Separator className="lg:w-1/3" />

        <FAQPosts />
      </PageLayout>
    </>
  );
};

function FAQPosts() {
  const { data, isLoading } = api.faq.getAll.useQuery();
  const [parent] = useAutoAnimate(/* optional config */);

  if (isLoading)
    return (
      <div className="flex grow">
        <LoadingSpinner />
      </div>
    );

  if (!data) return <div>Nothing to display</div>;
  return (
    <div className="flex flex-col space-y-2 " ref={parent}>
      {data.map((faq) => (
        <FAQCard faq={faq} key={faq.id} />
      ))}
    </div>
  );
}

export default FAQPage;
