import * as bcrypt from 'bcrypt';
import { AppDataSource } from './data-source';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { ProductCategory } from '../category/entities/category.entity';
import { Role } from '../rbac/entities/role.entity';
import { Permission } from '../rbac/entities/permission.entity';
import { UserRole } from '../rbac/entities/user-role.entity';
import { RolePermission } from '../rbac/entities/role-permission.entity';

// ── Data ──────────────────────────────────────────────────────────────────────

const roles = [
  { id: 1, name: 'admin', description: 'Administrator user.' },
  { id: 2, name: 'seller', description: 'A user that can list and sell products.' },
  { id: 3, name: 'buyer', description: 'A user that can view and buy.' },
];

const permissions = [
  { id: 1,  name: 'product:create',      description: 'Create new products' },
  { id: 2,  name: 'product:read',         description: 'View products' },
  { id: 3,  name: 'product:update:own',   description: 'Update own products' },
  { id: 4,  name: 'product:update:any',   description: 'Update any product' },
  { id: 5,  name: 'product:delete:own',   description: 'Delete own products' },
  { id: 6,  name: 'product:delete:any',   description: 'Delete any product' },
  { id: 7,  name: 'category:create',      description: 'Create categories' },
  { id: 8,  name: 'category:read',        description: 'View categories' },
  { id: 9,  name: 'category:update',      description: 'Update categories' },
  { id: 10, name: 'category:delete',      description: 'Delete categories' },
  { id: 11, name: 'user:read:own',        description: 'View own profile' },
  { id: 12, name: 'user:read:any',        description: 'View any user profile' },
  { id: 13, name: 'user:update:own',      description: 'Update own profile' },
  { id: 14, name: 'user:update:any',      description: 'Update any user' },
  { id: 15, name: 'user:delete:any',      description: 'Delete users' },
  { id: 16, name: 'role:manage',          description: 'Manage roles and permissions' },
  { id: 17, name: 'role:assign',          description: 'Assign roles to users' },
];

const rolePermissions = [
  // Admin — all
  ...Array.from({ length: 17 }, (_, i) => ({ roleId: 1, permissionId: i + 1 })),
  // Seller
  { roleId: 2, permissionId: 1  }, // product:create
  { roleId: 2, permissionId: 2  }, // product:read
  { roleId: 2, permissionId: 3  }, // product:update:own
  { roleId: 2, permissionId: 5  }, // product:delete:own
  { roleId: 2, permissionId: 8  }, // category:read
  { roleId: 2, permissionId: 11 }, // user:read:own
  { roleId: 2, permissionId: 13 }, // user:update:own
  // Buyer
  { roleId: 3, permissionId: 2  }, // product:read
  { roleId: 3, permissionId: 8  }, // category:read
  { roleId: 3, permissionId: 11 }, // user:read:own
  { roleId: 3, permissionId: 13 }, // user:update:own
];

const SEED_PASSWORD = 'Password123!';

const users = [
  { id: 1, email: 'admin@shop.com',   firstName: 'Admin', lastName: 'User',   roleId: 1 },
  { id: 2, email: 'seller1@shop.com', firstName: 'Alice', lastName: 'Seller', roleId: 2 },
  { id: 3, email: 'seller2@shop.com', firstName: 'Bob',   lastName: 'Seller', roleId: 2 },
  { id: 4, email: 'buyer1@shop.com',  firstName: 'Carol', lastName: 'Buyer',  roleId: 3 },
  { id: 5, email: 'buyer2@shop.com',  firstName: 'Dave',  lastName: 'Buyer',  roleId: 3 },
];

const categories = [
  { id: 1, name: "men's clothing" },
  { id: 2, name: "women's clothing" },
  { id: 3, name: 'jewelry' },
  { id: 4, name: 'electronics' },
];

const dummyProducts = [
  { id: 1,  title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops', price: 109.95, description: 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday', category: 1, image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png', ratingRate: 3.9, ratingCount: 120 },
  { id: 2,  title: 'Mens Casual Premium Slim Fit T-Shirts', price: 22.3, description: 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.', category: 1, image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png', ratingRate: 4.1, ratingCount: 259 },
  { id: 3,  title: 'Mens Cotton Jacket', price: 55.99, description: 'Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors.', category: 1, image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png', ratingRate: 4.7, ratingCount: 500 },
  { id: 4,  title: 'Mens Casual Slim Fit', price: 15.99, description: 'The color could be slightly different between on the screen and in practice.', category: 1, image: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png', ratingRate: 2.1, ratingCount: 430 },
  { id: 5,  title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet", price: 695, description: "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl.", category: 3, image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png', ratingRate: 4.6, ratingCount: 400 },
  { id: 6,  title: 'Solid Gold Petite Micropave', price: 168, description: 'Satisfaction Guaranteed. Return or exchange any order within 30 days.', category: 3, image: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png', ratingRate: 3.9, ratingCount: 70 },
  { id: 7,  title: 'White Gold Plated Princess', price: 9.99, description: 'Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her.', category: 3, image: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_t.png', ratingRate: 3, ratingCount: 400 },
  { id: 8,  title: 'Pierced Owl Rose Gold Plated Stainless Steel Double', price: 10.99, description: 'Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel', category: 3, image: 'https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_t.png', ratingRate: 1.9, ratingCount: 100 },
  { id: 9,  title: 'WD 2TB Elements Portable External Hard Drive - USB 3.0', price: 64, description: 'USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity', category: 4, image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png', ratingRate: 3.3, ratingCount: 203 },
  { id: 10, title: 'SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s', price: 109, description: 'Easy upgrade for faster boot up, shutdown, application load and response', category: 4, image: 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_t.png', ratingRate: 2.9, ratingCount: 470 },
  { id: 11, title: 'Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5', price: 109, description: '3D NAND flash are applied to deliver high transfer speeds', category: 4, image: 'https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_t.png', ratingRate: 4.8, ratingCount: 319 },
  { id: 12, title: 'WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive', price: 114, description: 'Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high capacity', category: 4, image: 'https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_t.png', ratingRate: 4.8, ratingCount: 400 },
  { id: 13, title: 'Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin', price: 599, description: '21. 5 inches Full HD (1920 x 1080) widescreen IPS display And Radeon free Sync technology.', category: 4, image: 'https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_t.png', ratingRate: 2.9, ratingCount: 250 },
  { id: 14, title: 'Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor - Super Ultrawide Screen QLED', price: 999.99, description: '49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side', category: 4, image: 'https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png', ratingRate: 2.2, ratingCount: 140 },
  { id: 15, title: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats", price: 56.99, description: 'Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100% Polyester', category: 2, image: 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png', ratingRate: 2.6, ratingCount: 235 },
  { id: 16, title: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket", price: 29.95, description: '100% POLYURETHANE(shell) 100% POLYESTER(lining)', category: 2, image: 'https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png', ratingRate: 2.9, ratingCount: 340 },
  { id: 17, title: 'Rain Jacket Women Windbreaker Striped Climbing Raincoats', price: 39.99, description: 'Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist design.', category: 2, image: 'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2t.png', ratingRate: 3.8, ratingCount: 679 },
  { id: 18, title: "MBJ Women's Solid Short Sleeve Boat Neck V", price: 9.85, description: '95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach', category: 2, image: 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png', ratingRate: 4.7, ratingCount: 130 },
  { id: 19, title: "Opna Women's Short Sleeve Moisture", price: 7.95, description: '100% Polyester, Machine wash, 100% cationic polyester interlock', category: 2, image: 'https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_t.png', ratingRate: 4.5, ratingCount: 146 },
  { id: 20, title: 'DANVOUY Womens T Shirt Casual Cotton Short', price: 12.99, description: '95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees', category: 2, image: 'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_t.png', ratingRate: 3.6, ratingCount: 145 },
];

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  await AppDataSource.initialize();

  const categoryRepo      = AppDataSource.getRepository(ProductCategory);
  const roleRepo          = AppDataSource.getRepository(Role);
  const permissionRepo    = AppDataSource.getRepository(Permission);
  const rolePermRepo      = AppDataSource.getRepository(RolePermission);
  const userRepo          = AppDataSource.getRepository(User);
  const userRoleRepo      = AppDataSource.getRepository(UserRole);
  const productRepo       = AppDataSource.getRepository(Product);

  await categoryRepo.save(categories);
  await roleRepo.save(roles);
  await permissionRepo.save(permissions);

  await rolePermRepo.clear();
  await rolePermRepo.save(rolePermissions.map((rp) => rolePermRepo.create(rp)));

  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 10);
  for (const user of users) {
    const { roleId, ...userData } = user;
    await userRepo.save({ ...userData, password: hashedPassword });
  }

  await userRoleRepo.clear();
  await userRoleRepo.save(
    users.map((u) => userRoleRepo.create({ userId: u.id, roleId: u.roleId })),
  );

  const productData = dummyProducts.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    description: p.description,
    image: p.image,
    ratingRate: p.ratingRate,
    ratingCount: p.ratingCount,
    stock: 50,
    categoryId: p.category,
    ownerId: p.id % 2 === 0 ? 3 : 2,
  }));
  await productRepo.save(productData);

  console.log('Seeding completed.');
  console.log(`  - ${categories.length} categories`);
  console.log(`  - ${roles.length} roles`);
  console.log(`  - ${permissions.length} permissions`);
  console.log(`  - ${rolePermissions.length} role-permission mappings`);
  console.log(`  - ${users.length} users (password: ${SEED_PASSWORD})`);
  console.log(`  - ${dummyProducts.length} products`);
}

main()
  .then(() => AppDataSource.destroy())
  .catch((e) => {
    console.error(e);
    AppDataSource.destroy();
    process.exit(1);
  });
