import { IUserDto } from "../features/user/schemas.js";

declare global {
  namespace Express {
    interface Request {
      user?: IUserDto;
      userPermissions?: string[]; // User's actual permissions (fetched once by middleware)
    }
  }
}

export {};
