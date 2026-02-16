import * as bcrypt from "bcrypt";

export class AuthService {
  private static SALT_ROUNDS = 12;

  static async hashPassword(password: string) {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
