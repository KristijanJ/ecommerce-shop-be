import { prisma } from "../../lib/prisma.js";
import { IUser, IUserDto } from "./schemas.js";

export class UserRepository {
  static async GetUserById(id: number) {
    try {
      const user = await prisma.user.findFirst({ where: { id } });

      if (!user) return null;

      const userValue: IUserDto = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      return userValue;
    } catch (error) {
      throw error;
    }
  }

  static async GetUserByEmail(email: string) {
    try {
      const user = await prisma.user.findFirst({ where: { email } });

      if (!user) return null;

      const userValue: IUserDto = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      return userValue;
    } catch (error) {
      throw error;
    }
  }

  static async SaveUser(newUser: IUser) {
    try {
      let user = null;

      if (newUser.id) {
        user = await prisma.user.update({
          where: { id: newUser.id },
          data: newUser,
        });
      } else {
        user = await prisma.user.create({
          data: newUser,
        });
      }

      const userValue: IUserDto = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      return userValue;
    } catch (error) {
      throw error;
    }
  }
}
