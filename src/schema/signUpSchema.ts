import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(4, "Username must be at least 4 characters")
  .max(8, "Username must be at most 8 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character");

export const signUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});
