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

      // WIP
      const user = await UserService.GetUser({ email: req.body.email, withPassword: true });

      if (!user) {
        return res.status(404).json({
          data: null,
        });
      }

      return res.status(200).json({
        data: user,
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
      });

      return res.status(200).json({
        data: user,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: JSON.parse(error.message) });
      }
      return res.status(500).json({ error: "something went wrong" });
    }
  }

  static async ForgotPassword(req: Request, res: Response) {
    return res.status(200).json({ data: [] });
  }
}
