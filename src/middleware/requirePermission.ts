import { NextFunction, Request, Response } from "express";
import { RBAC } from "../features/rbac/service.js";

/**
 * Middleware to check required permissions for an action
 * @param permissions - array of required permissions (user needs at least one)
 */
export const requirePermissions = (requiredPermissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hasPermission = await RBAC.CheckPermissions(req.user?.roles ?? [], requiredPermissions);

      if (!hasPermission) {
        return res.status(403).json({
          error: "Forbidden",
          message: `Requires one of: ${requiredPermissions.join(", ")}`,
        });
      }

      next();
    } catch (error) {
      console.error("Required permission setup failed:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
};
