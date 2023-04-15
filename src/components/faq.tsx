import { Button } from "~/ui/button";

import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "~/components/Loading";
import { useToast } from "~/hooks/useToast";
import { FAQFormSchema } from "~/schema/FAQForm";
import { Label } from "~/ui/label";
import { Textarea } from "~/ui/textarea";
import { api } from "~/utils/api";
import { useZodForm } from "~/utils/zod-form";

import { DialogClose } from "@radix-ui/react-dialog";
import relativeTime from "dayjs/plugin/relativeTime";
import { Trash2Icon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/ui/dialog";
import { type RouterOutputs } from "~/utils/api";

export const FAQForm = () => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const methods = useZodForm({
    schema: FAQFormSchema,
  });

  const utils = api.useContext();
  const createFAQ = api.faq.create.useMutation({
    onSettled: async (data, error) => {
      await utils.faq.invalidate();
      methods.reset();
      if (!error) {
        toast({
          title: "Successfully posted a FAQ!",
          description: "Close the Modal to check.",
        });
      } else {
        toast({
          title: "Something went wrong!",
          description: error.message,
        });
      }
    },
  });

  const onSubmit = methods.handleSubmit(
    (data) => {
      // console.log(data);
      createFAQ.mutate(data);
    },
    (e) => {
      console.log("Whoops... something went wrong!");
      console.error(e);
    }
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form action="" className="flex flex-col gap-4" onSubmit={onSubmit}>
      <div className="space-y-1">
        <Label htmlFor="name">Question</Label>
        <Textarea
          id="name"
          placeholder="What is my favorite programming language?"
          {...methods.register("question")}
        />
        <p className="font-medium text-red-500">
          {methods.formState.errors?.question?.message}
        </p>
      </div>
      <div className="space-y-1">
        <Label htmlFor="text">Answer</Label>
        <Textarea
          id="text"
          placeholder="Jake++"
          {...methods.register("answer")}
        />
        <p className="font-medium text-red-500">
          {methods.formState.errors?.answer?.message}
        </p>
      </div>

      <Button type="submit" disabled={!session}>
        {!session ? (
          "Sign in to Post"
        ) : createFAQ.isLoading ? (
          <>
            <LoadingSpinner />
            <span>Loading ...</span>
          </>
        ) : (
          "Post"
        )}
      </Button>
      <p className="font-medium text-red-500">{createFAQ.error?.message}</p>
    </form>
  );
};

export function FAQCard(props: {
  faq: RouterOutputs["faq"]["getAll"][number];
}) {
  const { data: session } = useSession();
  const { faq } = props;
  const utils = api.useContext();
  const deletePost = api.faq.delete.useMutation({
    onSettled: async () => {
      await utils.faq.invalidate();
    },
  });
  dayjs.extend(relativeTime);

  return (
    <div className="flex max-w-md flex-1 flex-row rounded-lg bg-white/10 p-4 shadow-md transition-all hover:scale-[101%] lg:max-w-lg">
      <Link href={`/user/${faq.user.id}`}>
        <Avatar className="mr-2 self-center">
          <AvatarImage src={faq.user.image?.toString()} alt="@shadcn" />
          <AvatarFallback>{faq.user.name?.substring(0, 2)}</AvatarFallback>
        </Avatar>
      </Link>
      <Link href={`/faq/${faq.id}`} className="w-full">
        <div className="flex-grow">
          <h2 className="text-2xl font-bold">{faq.question}</h2>
          <p className="mt-2 text-sm">{faq.answer}</p>
          <p className="font-thin opacity-50">{`Posted ${dayjs(
            faq.createdAt
          ).fromNow()}`}</p>
        </div>
      </Link>
      <Dialog>
        <DialogTrigger asChild>
          {faq.user.id === session?.user.id && (
            <Button
              variant="destructive"
              data-testid={`delete-post-${faq.question}`}
            >
              <Trash2Icon />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this post? This action cannot be
            reverted.
          </DialogDescription>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="destructive"
                disabled={!session}
                onClick={() => deletePost.mutate({ id: faq.id })}
              >
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
