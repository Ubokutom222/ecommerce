import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import db from "@/db";
import { usersCart, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const cartRouter = createTRPCRouter({
  getCart: protectedProcedure.query(async ({ ctx }) => {
    const response = await db
      .select()
      .from(usersCart)
      .where(eq(usersCart.user, ctx.session.user.id))
      .innerJoin(products, eq(products.id, usersCart.product));
    if (!response)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });

    return response;
  }),
  updateQuantity: protectedProcedure
    .input(z.object({ quantity: z.number(), productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const response = await db
        .update(usersCart)
        .set({
          quantity: input.quantity,
        })
        .where(
          and(
            eq(usersCart.product, input.productId),
            eq(usersCart.user, ctx.session.user.id),
          ),
        )
        .returning();

      if (!response)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });

      return response;
    }),
});

export default cartRouter;
