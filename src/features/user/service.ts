import { UserRepository } from "./repository.js";
import { IUser } from "./schemas.js";

interface IGetUser {
  id?: number;
  email?: string;
  withPassword?: boolean;
}

export class UserService {
  static async GetUser({ id, email, withPassword = false }: IGetUser) {
    try {
      if (id) {
        const user = await UserRepository.GetUserById(id, withPassword);
        return user;
      }

      if (email) {
        const user = await UserRepository.GetUserByEmail(email, withPassword);
        return user;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  static async CreateUser(newUser: IUser) {
    try {
      const existingUser = await this.GetUser({ email: newUser.email });
      if (existingUser) {
        throw new Error("user_with_email_exists");
      }

      const user = UserRepository.SaveUser(newUser);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
