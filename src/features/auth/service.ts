import * as bcrypt from "bcrypt";

import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { IUserDto } from "../user/schemas.js";
import logger from "../../lib/logger.js";

interface CustomJWTPayload extends JWTPayload {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export class AuthService {
  private static SALT_ROUNDS = 12;

  static async hashPassword(password: string) {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  static async createJwt(user: IUserDto) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new SignJWT({ sub: "jovanovski", ...user })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(secret);

    return token;
  }

  static async verifyJwt(token: string): Promise<CustomJWTPayload | null> {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);

      const { payload } = await jwtVerify(token, secret, {
        subject: "jovanovski",
      });

      return payload as CustomJWTPayload;
    } catch (error) {
      logger.warn({ err: error }, "JWT verification failed");
      return null;
    }
  }
}
