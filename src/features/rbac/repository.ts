import { prisma } from "../../lib/prisma.js";

export class RBACRepository {
  static async FetchRolePermissions(roles: string[]) {
    try {
      const rolePermissions = await prisma.role.findMany({
        where: { name: { in: roles } },
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      });

      const flattenRolePermissions = rolePermissions.flatMap((role) =>
        role.rolePermissions.map((rp) => rp.permission.name),
      );

      return flattenRolePermissions;
    } catch (error) {
      throw error;
    }
  }
}
