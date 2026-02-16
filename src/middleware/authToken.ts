import { NextFunction, Request, Response } from "express";
import { AuthService } from "../features/auth/service.js";

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = typeof authHeader === "string" ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  const payload = await AuthService.verifyJwt(token);

  if (!payload) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  req.user = {
    id: payload.id,
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
  }

  next();
};
