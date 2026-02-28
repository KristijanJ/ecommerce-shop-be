import { NextFunction, Request, Response } from "express";
import { RBACRepository } from "../features/rbac/repository.js";
import logger from "../lib/logger.js";

/**
 * Middleware to fetch and attach user permissions to request
 * Controller will check specific permissions as needed
 */
export const loadPermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.roles) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch user's permissions once from DB and attach to request
    const userPermissions = await RBACRepository.FetchRolePermissions(req.user.roles);
    req.userPermissions = userPermissions;

    next();
  } catch (error) {
    logger.error({ err: error }, "Failed to load permissions");
    return res.status(500).json({ error: "Internal server error" });
  }
};
