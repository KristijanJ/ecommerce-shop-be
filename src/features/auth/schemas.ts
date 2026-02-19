import * as z from "zod";

export const LoginRequestSchema = z.object({
  email: z.email({ error: "Email is required." }),
  password: z.string({ error: "Password is required." }).min(1, "Password cannot be empty."),
});

export const RegisterRequestSchema = z
  .object({
    email: z.email({ error: "Email is required." }),
    confirmEmail: z.email({ error: "Confirm Email is required." }),
    password: z.string({ error: "Password is required." }).min(8, "Password must contain 8 or more characters."),
    firstName: z.string({ error: "First name is required." }).min(1, "First name cannot be empty."),
    lastName: z.string({ error: "Last name is required." }).min(1, "Last name cannot be empty."),
    role: z.enum(["buyer", "seller"], { error: "Role must be buyer or seller." }),
  })
  .refine((data) => data.email === data.confirmEmail, {
    error: "Emails must match.",
    path: ["email", "confirmEmail"],
  });
