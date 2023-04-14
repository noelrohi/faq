import { z } from "zod";
import { FAQFormSchema } from "~/schema/FAQForm";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const faqRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.fAQ.findUnique({
        where: { id: input.id },
        include: {
          user: {
            select: {
              image: true,
              name: true,
              id: true,
            }
          }
        }
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.fAQ.findMany({
      include: {
        user: {
          select: {
            image: true,
            name: true,
            id: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }],
    });
  }),

  create: protectedProcedure.input(FAQFormSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.fAQ.create({
      data: {
        question: input.question,
        answer: input.answer,
        user: { connect: { id: ctx.session.user.id } },
      },
    });
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.fAQ.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
