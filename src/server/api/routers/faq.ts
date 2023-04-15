import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
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
            },
          },
        },
      });
    }),
  getAllByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
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
        where: {
          userId: input.userId,
        },
        orderBy: [{ createdAt: "desc" }],
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

  create: protectedProcedure
    .input(FAQFormSchema)
    .mutation(async ({ ctx, input }) => {
      const ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(3, "1 m"),
        analytics: true,
      });
      const { success } = await ratelimit.limit(ctx.session.user.id);
      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message:
            "Too many requests, try again in 1 min. You can only post 3  per minute.",
        });
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
