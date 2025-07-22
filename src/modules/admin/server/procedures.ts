import {
  baseProcedure,
  /*adminProcedure, */ createTRPCRouter,
} from "@/trpc/init";
import { SignInSchema } from "../schema";
import { TRPCError } from "@trpc/server";
import auth from "@/lib/auth";

const adminRouter = createTRPCRouter({
  signIn: baseProcedure.input(SignInSchema).mutation(async ({ input }) => {
    const { email, password } = input;
    if (!email || !password) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid Credentials",
      });
    }

    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    if (!response) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
    return response;
  }),
});

export default adminRouter;
