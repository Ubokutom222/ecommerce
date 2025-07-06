import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().nonempty({ message: "Password is required" }),
});

export type SignInType = z.infer<typeof SignInSchema>;

export const SignUpSchema = z
  .object({
    firstname: z.string().nonempty({ message: "Enter Your First Name" }),
    lastname: z.string().nonempty({ message: "Enter your last name" }),
    email: z.string().email({ message: "Enter a valid email" }),
    password: z
      .string()
      .nonempty({ message: "Password is required" })
      .min(8, { message: "Password must have at least eight characters" }),
    confirmPassword: z
      .string()
      .nonempty({ message: "Password is required" })
      .min(8, { message: "Password must have at least eight characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"], // Error will be associated with the confirmPassword field
  });

export type SignUpType = z.infer<typeof SignUpSchema>;
