import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "@/db"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import * as schema from "@/db/schema";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, vendor, customer } from "./utils";

const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: {
      ...schema,
    },
  }),
  plugins: [
    nextCookies(),
    adminPlugin({
      ac,
      roles: {
        admin,
        vendor,
        customer,
      },
    }),
  ],
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["https://oriented-hugely-glider.ngrok-free.app"],
});

export default auth;
