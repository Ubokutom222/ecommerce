import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "@/db"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import * as schema from "@/db/schema";

const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: {
      ...schema,
    },
  }),
  plugins: [nextCookies()],
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["https://oriented-hugely-glider.ngrok-free.app"],
});

export default auth;
