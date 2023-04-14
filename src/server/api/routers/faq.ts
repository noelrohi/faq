import { FAQFormSchema } from "~/pages/faq";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const faqRouter = createTRPCRouter({

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.fAQ.findMany({
        include: {
            user: {
                select : {
                    image: true,
                    name: true,
                    id: true,
                    
                }
            }
        }
    });
  }),

  create: protectedProcedure
    .input(FAQFormSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.fAQ.create({
        data: {
          question: input.question,
          answer: input.answer,
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

});
