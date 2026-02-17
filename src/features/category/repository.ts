import { prisma } from "../../lib/prisma.js";

export class CategoryRepository {
  static async FetchCategories() {
    return prisma.productCategory.findMany({
      select: { id: true, name: true },
      where: { isActive: true },
    });
  }
}
