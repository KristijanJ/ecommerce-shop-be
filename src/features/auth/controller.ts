import { Request, Response } from "express";
import { LoginRequestSchema, RegisterRequestSchema } from "./schemas.js";
import { ZodError } from "zod";
import { AuthService } from "./service.js";
import { UserService } from "../user/service.js";

export class AuthController {
  static async Login(req: Request, res: Response) {
    try {
      const body = LoginRequestSchema.parse(req.body);
      const password = await AuthService.hashPassword(body.password);

      const user = await UserService.GetUser({ email: req.body.email, withPassword: true });

      if (!user) {
        return res.status(404).json({
          data: null,
        });
      }

      const isPassValid = await AuthService.verifyPassword(req.body.password, user.password!);
      if (!isPassValid) {
        return res.status(401).json({
          data: null,
        });
      }

      const token = await AuthService.createJwt({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
      });

      return res.status(200).json({
        token: token,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: JSON.parse(error.message) });
      }
      return res.status(500).json({ error: "something went wrong" });
    }
  }

  static async Register(req: Request, res: Response) {
    try {
      const body = RegisterRequestSchema.parse(req.body);
      const password = await AuthService.hashPassword(body.password);

      const user = await UserService.CreateUser({
        email: body.email,
        password: password,
        firstName: body.firstName,
        lastName: body.lastName,
        role: body.role,
      });

      const token = await AuthService.createJwt({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
      });

      return res.status(200).json({
        token: token,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: JSON.parse(error.message) });
      }
      if (error instanceof Error) {
        if (error.message === "user_with_email_exists") {
          return res.status(400).json({ error: "A user with this email already exists." });
        } else {
          return res.status(500).json({ error: "Something went wrong." });
        }
      }
      return res.status(500).json({ error: "Something went wrong." });
    }
  }

  static async ForgotPassword(req: Request, res: Response) {
    return res.status(200).json({ data: [] });
  }
}
