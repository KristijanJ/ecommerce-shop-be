import { prisma } from "../src/lib/prisma";

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

  console.log("✅ Seeding completed.");
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${roles.length} roles`);
  console.log(`   - ${permissions.length} permissions`);
  console.log(`   - ${rolePermissions.length} role-permission mappings`);
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
