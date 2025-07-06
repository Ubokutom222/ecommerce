import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import db from "@/db";
import { products } from "@/db/schema";

const userRouter = createTRPCRouter({
  getProducts: baseProcedure.query(async () => {
    const response = await db.select().from(products);
    return response;
  }),
});

export default userRouter;
