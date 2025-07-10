import {
  createTRPCRouter,
  protectedProcedure,
  baseProcedure,
} from "@/trpc/init";
import { z } from "zod";
import db from "@/db";
import { categories, products, usersCart } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

const productsRouter = createTRPCRouter({
  getProductInfo: baseProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const response = await db
        .select()
        .from(products)
        .where(eq(products.id, input.productId))
        .innerJoin(categories, eq(products.category, categories.id));
      return response;
    }),
  addToCart: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { productId, quantity } = input;
      if (!productId || typeof quantity !== "number")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Client Error",
        });
      const newCartItem = await db
        .insert(usersCart)
        .values({
          id: nanoid(),
          userId: ctx.session.user.id,
          productId: productId,
          quantity,
        })
        .returning();

      if (!newCartItem)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });

      return newCartItem;
    }),
  removeFromCart: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { productId } = input;

      if (!productId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Product is undefined",
        });

      const response = await db
        .delete(usersCart)
        .where(
          and(
            eq(usersCart.productId, productId),
            eq(usersCart.userId, ctx.session.user.id),
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

export default productsRouter;
