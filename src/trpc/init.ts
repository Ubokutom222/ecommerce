import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";
import auth from "@/lib/auth";
import { headers } from "next/headers";
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async (req) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new TRPCError({ code: "UNAUTHORIZED" });
  return req.next({
    ctx: {
      session,
    },
  });
});

export const adminProcedure = t.procedure.use(async (req) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new TRPCError({ code: "UNAUTHORIZED" });
  const { role } = session.user;
  if (role !== "admin" && role !== "vendor")
    throw new TRPCError({ code: "UNAUTHORIZED" });
  return req.next({
    ctx: {
      session,
    },
  });
});
