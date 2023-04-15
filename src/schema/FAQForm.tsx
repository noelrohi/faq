import { z } from "zod";

export const FAQFormSchema = z.object({
  question: z.string().min(3).includes("?"),
  answer: z.string().min(2),
});
