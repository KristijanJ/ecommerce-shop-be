import { RBACRepository } from "./repository.js";

export class RBAC {
  static async CheckPermissions(roles: string[], permissions: string[]) {
    try {
      const rolePermissions = await RBACRepository.FetchRolePermissions(roles);

      const hasPermissions = rolePermissions.some((perm) => permissions.includes(perm));

      return hasPermissions;
    } catch (error) {
      throw error;
    }
  }
}
