import { Button } from "~/ui/button";

import { useSession } from "next-auth/react";
import { LoadingSpinner } from "~/components/Loading";
import { useToast } from "~/hooks/useToast";
import { FAQFormSchema } from "~/schema/FAQForm";
import { Label } from "~/ui/label";
import { Textarea } from "~/ui/textarea";
import { api } from "~/utils/api";
import { useZodForm } from "~/utils/zod-form";

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
}
