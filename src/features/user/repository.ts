import { prisma } from "../../lib/prisma.js";
import { IUser, IUserDto } from "./schemas.js";

export class UserRepository {
  static async GetUserById(id: number, withPassword: boolean = false): Promise<IUserDto | null> {
    try {
      const user = await prisma.user.findFirst({
        where: { id, isActive: true },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          password: withPassword,
          userRoles: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                },
              },
            },
          },
        },
      });

      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        roles: user.userRoles.map((ur) => ur.role.name),
      };
    } catch (error) {
      throw error;
    }
  }

  static async GetUserByEmail(email: string, withPassword: boolean = false): Promise<IUserDto | null> {
    try {
      const user = await prisma.user.findFirst({
        where: { email, isActive: true },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          password: withPassword,
          userRoles: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                },
              },
            },
          },
        },
      });

      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        roles: user.userRoles.map((ur) => ur.role.name),
      };
    } catch (error) {
      throw error;
    }
  }

  static async SaveUser(newUser: IUser) {
    try {
      const { role, ...userData } = newUser;

      let user = null;

      if (userData.id) {
        user = await prisma.user.update({
          where: { id: userData.id },
          data: userData,
        });
      } else {
        user = await prisma.user.create({
          data: userData,
        });
      }

      if (role) {
        const roleRecord = await prisma.role.findFirst({
          where: { name: role, isActive: true },
        });

        if (roleRecord) {
          await prisma.userRole.create({
            data: { userId: user.id, roleId: roleRecord.id },
          });
        }
      }

      const userValue: IUserDto = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: role ? [role] : [],
      };

      return userValue;
    } catch (error) {
      throw error;
    }
  }
}
