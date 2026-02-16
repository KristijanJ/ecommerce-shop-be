import { IUserDto } from "../features/user/schemas.js";

declare global {
  namespace Express {
    interface Request {
      user?: IUserDto;
    }
  }
}

export {};
