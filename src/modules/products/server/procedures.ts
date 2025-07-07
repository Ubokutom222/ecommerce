import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import db from "@/db";
import { categories, products } from "@/db/schema";
import { eq } from "drizzle-orm";

const productsRouter = createTRPCRouter({
  getProductInfo: protectedProcedure
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
});

export default productsRouter;
