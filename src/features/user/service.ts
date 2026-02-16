import { UserRepository } from "./repository.js";
import { IUser } from "./schemas.js";

interface IGetUser {
  id?: number;
  email?: string;
}

export class UserService {
  static async GetUser({ id, email }: IGetUser) {
    try {
      if (id) {
        const user = await UserRepository.GetUserById(id);
        return user;
      }

      if (email) {
        const user = await UserRepository.GetUserByEmail(email);
        return user;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  static async CreateUser(newUser: IUser) {
    try {
      const user = UserRepository.SaveUser(newUser);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
