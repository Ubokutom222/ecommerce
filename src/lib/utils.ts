import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const statement = {
  ...defaultStatements,
  products: ["create", "share", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  products: ["create", "update", "delete"],
  ...adminAc.statements,
});

export const vendor = ac.newRole({
  products: ["create", "update", "delete"],
});

export const customer = ac.newRole({
  products: [],
});
