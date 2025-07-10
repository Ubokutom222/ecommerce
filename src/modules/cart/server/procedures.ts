import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import db from "@/db";
import { usersCart, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import axios from "axios";

const cartRouter = createTRPCRouter({
  getCart: protectedProcedure.query(async ({ ctx }) => {
    const response = await db
      .select()
      .from(usersCart)
      .where(eq(usersCart.userId, ctx.session.user.id))
      .innerJoin(products, eq(products.id, usersCart.productId));
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
            eq(usersCart.productId, input.productId),
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
  checkout: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
        products: z.array(
          z.object({
            id: z.string(),
            quantity: z.number(),
            unitPrice: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await axios.post(
          "https://api.paystack.co/transaction/initialize",
          {
            amount: input.amount,
            email: ctx.session.user.email,
            metadata: {
              userId: ctx.session.user.id,
              products: input.products,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET!}`,
            },
          },
        );

        if (!response.data || !response.data.data.authorization_url) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to initialize payment",
          });
        }

        return { url: response.data.data.authorization_url };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});

export default cartRouter;
