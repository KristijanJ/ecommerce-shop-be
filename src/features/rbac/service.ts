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

  /**
   * Pure function to check if user can perform action on a resource
   * @param userPermissions - User's permissions
   * @param userId - Current user's ID
   * @param resourceOwnerId - Owner ID of the resource being accessed
   * @param requiredPermissions - Required permissions (can include :own and :any variants)
   * @returns true if user can perform the action
   */
  static CanPerformAction(
    userPermissions: string[],
    userId: number,
    resourceOwnerId: number,
    requiredPermissions: string[],
  ): boolean {
    // Check if user has any :any permissions (bypasses ownership)
    const anyPermissions = requiredPermissions.filter((p) => p.endsWith(":any"));
    const hasAnyPermission = userPermissions.some((perm) => anyPermissions.includes(perm));

    if (hasAnyPermission) {
      return true; // Admin override
    }

    // Check if user has :own permission AND owns the resource
    const ownPermissions = requiredPermissions.filter((p) => p.endsWith(":own"));
    const hasOwnPermission = userPermissions.some((perm) => ownPermissions.includes(perm));

    if (hasOwnPermission && userId === resourceOwnerId) {
      return true; // User owns it
    }

    // Check for non-scoped permissions (no :own/:any suffix)
    const genericPermissions = requiredPermissions.filter((p) => !p.endsWith(":own") && !p.endsWith(":any"));
    const hasGenericPermission = userPermissions.some((perm) => genericPermissions.includes(perm));

    if (hasGenericPermission) {
      return true;
    }

    return false;
  }
}
