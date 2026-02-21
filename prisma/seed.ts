import * as bcrypt from "bcrypt";

import { prisma } from "../src/lib/prisma";
import dummyProducts from "../dummy-products.js";

const roles = [
  {
    id: 1,
    name: "admin",
    description: "Administrator user.",
  },
  {
    id: 2,
    name: "seller",
    description: "A user that can list and sell products.",
  },
  {
    id: 3,
    name: "buyer",
    description: "A user that can view and buy.",
  },
];

const permissions = [
  // Product permissions
  { id: 1, name: "product:create", description: "Create new products" },
  { id: 2, name: "product:read", description: "View products" },
  { id: 3, name: "product:update:own", description: "Update own products" },
  { id: 4, name: "product:update:any", description: "Update any product" },
  { id: 5, name: "product:delete:own", description: "Delete own products" },
  { id: 6, name: "product:delete:any", description: "Delete any product" },

  // Category permissions
  { id: 7, name: "category:create", description: "Create categories" },
  { id: 8, name: "category:read", description: "View categories" },
  { id: 9, name: "category:update", description: "Update categories" },
  { id: 10, name: "category:delete", description: "Delete categories" },

  // User permissions
  { id: 11, name: "user:read:own", description: "View own profile" },
  { id: 12, name: "user:read:any", description: "View any user profile" },
  { id: 13, name: "user:update:own", description: "Update own profile" },
  { id: 14, name: "user:update:any", description: "Update any user" },
  { id: 15, name: "user:delete:any", description: "Delete users" },

  // Role & permission management
  { id: 16, name: "role:manage", description: "Manage roles and permissions" },
  { id: 17, name: "role:assign", description: "Assign roles to users" },
];

// Map roles to permissions
const rolePermissions = [
  // Admin - all permissions
  { roleId: 1, permissionId: 1 },
  { roleId: 1, permissionId: 2 },
  { roleId: 1, permissionId: 3 },
  { roleId: 1, permissionId: 4 },
  { roleId: 1, permissionId: 5 },
  { roleId: 1, permissionId: 6 },
  { roleId: 1, permissionId: 7 },
  { roleId: 1, permissionId: 8 },
  { roleId: 1, permissionId: 9 },
  { roleId: 1, permissionId: 10 },
  { roleId: 1, permissionId: 11 },
  { roleId: 1, permissionId: 12 },
  { roleId: 1, permissionId: 13 },
  { roleId: 1, permissionId: 14 },
  { roleId: 1, permissionId: 15 },
  { roleId: 1, permissionId: 16 },
  { roleId: 1, permissionId: 17 },

  // Seller - can manage own products
  { roleId: 2, permissionId: 1 }, // product:create
  { roleId: 2, permissionId: 2 }, // product:read
  { roleId: 2, permissionId: 3 }, // product:update:own
  { roleId: 2, permissionId: 5 }, // product:delete:own
  { roleId: 2, permissionId: 8 }, // category:read
  { roleId: 2, permissionId: 11 }, // user:read:own
  { roleId: 2, permissionId: 13 }, // user:update:own

  // Buyer - can only view products and manage own profile
  { roleId: 3, permissionId: 2 }, // product:read
  { roleId: 3, permissionId: 8 }, // category:read
  { roleId: 3, permissionId: 11 }, // user:read:own
  { roleId: 3, permissionId: 13 }, // user:update:own
];

const SEED_PASSWORD = "Password123!";

const users = [
  {
    id: 1,
    email: "admin@shop.com",
    firstName: "Admin",
    lastName: "User",
    roleId: 1, // admin
  },
  {
    id: 2,
    email: "seller1@shop.com",
    firstName: "Alice",
    lastName: "Seller",
    roleId: 2, // seller
  },
  {
    id: 3,
    email: "seller2@shop.com",
    firstName: "Bob",
    lastName: "Seller",
    roleId: 2, // seller
  },
  {
    id: 4,
    email: "buyer1@shop.com",
    firstName: "Carol",
    lastName: "Buyer",
    roleId: 3, // buyer
  },
  {
    id: 5,
    email: "buyer2@shop.com",
    firstName: "Dave",
    lastName: "Buyer",
    roleId: 3, // buyer
  },
];

const categories = [
  {
    id: 1,
    name: "men's clothing",
  },
  {
    id: 2,
    name: "women's clothing",
  },
  {
    id: 3,
    name: "jewelry",
  },
  {
    id: 4,
    name: "electronics",
  },
];

async function main() {
  // Seed categories
  for (const category of categories) {
    await prisma.productCategory.upsert({
      where: { id: category.id },
      create: category,
      update: category,
    });
  }

  // Seed roles
  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      create: role,
      update: role,
    });
  }

  // Seed permissions
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { id: permission.id },
      create: permission,
      update: permission,
    });
  }

  // Seed role permissions (delete existing first to avoid conflicts)
  await prisma.rolePermission.deleteMany({});
  for (const rp of rolePermissions) {
    await prisma.rolePermission.create({
      data: rp,
    });
  }

  // Seed users
  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 10);
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: hashedPassword,
      },
      update: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: hashedPassword,
      },
    });
  }

  // Seed user roles (delete existing first to avoid conflicts)
  await prisma.userRole.deleteMany({});
  for (const user of users) {
    await prisma.userRole.create({
      data: { userId: user.id, roleId: user.roleId },
    });
  }

  // Seed products — split between the two sellers
  // seller1 (id: 2) gets odd-indexed products, seller2 (id: 3) gets even-indexed
  for (const product of dummyProducts) {
    const ownerId = product.id % 2 === 0 ? 3 : 2;
    await prisma.product.upsert({
      where: { id: product.id },
      create: {
        id: product.id,
        title: product.title,
        price: product.price,
        description: product.description,
        image: product.image,
        ratingRate: product.ratingRate,
        ratingCount: product.ratingCount,
        stock: 50,
        productCategoryId: product.category,
        ownerId,
      },
      update: {
        title: product.title,
        price: product.price,
        description: product.description,
        image: product.image,
        ratingRate: product.ratingRate,
        ratingCount: product.ratingCount,
        stock: 50,
        productCategoryId: product.category,
        ownerId,
      },
    });
  }

  console.log("✅ Seeding completed.");
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${roles.length} roles`);
  console.log(`   - ${permissions.length} permissions`);
  console.log(`   - ${rolePermissions.length} role-permission mappings`);
  console.log(`   - ${users.length} users (password: ${SEED_PASSWORD})`);
  console.log(`   - ${dummyProducts.length} products`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
