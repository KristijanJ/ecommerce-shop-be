import * as z from "zod";

export const UserSchema = z.object({
  email: z.email({ error: "Email is required." }),
  password: z.string({ error: "Password is required." }).min(8, "Password must contain 8 or more characters."),
  firstName: z.string({ error: "First name is required." }).min(1, "First name cannot be empty."),
  lastName: z.string({ error: "Last name is required." }).min(1, "Last name cannot be empty."),
});

export interface IUser extends z.infer<typeof UserSchema> {
  id?: number;
  role?: string;
}

export interface IUserDto {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  roles: string[];
}
