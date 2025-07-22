import authRouter from "@/modules/auth/server/procedures";
import userRouter from "@/modules/user/server/procedures";
import productRouter from "@/modules/products/server/procedures";
import cartRouter from "@/modules/cart/server/procedures";
import adminRouter from "@/modules/admin/server/procedures";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  products: productRouter,
  cart: cartRouter,
  admin: adminRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
