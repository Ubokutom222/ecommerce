import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { SignInSchema, SignUpSchema } from "../schemas";
import { TRPCError } from "@trpc/server";
import auth from "@/lib/auth";

const authRouter = createTRPCRouter({
  sign_in: baseProcedure.input(SignInSchema).mutation(async ({ input }) => {
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
  sign_up: baseProcedure.input(SignUpSchema).mutation(async ({ input }) => {
    const { email, password, firstname, lastname } = input;
    if (!email || !password || !firstname || !lastname)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid Credentials",
      });

    const response = await auth.api.signUpEmail({
      body: {
        name: `${firstname} ${lastname}`,
        email,
        password,
        callbackURL: "/",
      },
    });
    return response;
  }),
});

export default authRouter;
