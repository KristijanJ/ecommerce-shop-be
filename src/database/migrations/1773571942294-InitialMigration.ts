import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1773571942294 implements MigrationInterface {
    name = 'InitialMigration1773571942294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "price" double precision NOT NULL, "description" character varying NOT NULL, "image" character varying NOT NULL, "ratingRate" double precision NOT NULL, "ratingCount" integer NOT NULL, "stock" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "categoryId" integer NOT NULL, "ownerId" integer NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ff0c0301a95e517153df97f681" ON "product" ("categoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8992dd65608730f9b3922e5278" ON "product" ("ownerId", "categoryId") `);
        await queryRunner.query(`CREATE TABLE "product_category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_0dce9bc93c2d2c399982d04bef1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payment_status_enum" AS ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "status" "public"."payment_status_enum" NOT NULL DEFAULT 'PENDING', "amount" integer NOT NULL, "purchaseId" integer NOT NULL, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."purchase_status_enum" AS ENUM('PENDING', 'PAID', 'CANCELLED', 'REFUNDED')`);
        await queryRunner.query(`CREATE TABLE "purchase" ("id" SERIAL NOT NULL, "buyerId" integer NOT NULL, "amount" integer NOT NULL, "status" "public"."purchase_status_enum" NOT NULL DEFAULT 'PENDING', CONSTRAINT "PK_86cc2ebeb9e17fc9c0774b05f69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum" AS ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "buyerId" integer NOT NULL, "sellerId" integer NOT NULL, "purchaseId" integer, "status" "public"."order_status_enum" NOT NULL DEFAULT 'PENDING', CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_item" ("id" SERIAL NOT NULL, "orderId" integer NOT NULL, "productId" integer NOT NULL, "quantity" integer NOT NULL, "priceAtPurchase" integer NOT NULL, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_240853a0c3353c25fb12434ad33" UNIQUE ("name"), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_role" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_7b4e17a669299579dfa55a3fc35" PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`CREATE TABLE "role_permission" ("roleId" integer NOT NULL, "permissionId" integer NOT NULL, CONSTRAINT "PK_b42bbacb8402c353df822432544" PRIMARY KEY ("roleId", "permissionId"))`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "product_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_cbb5d890de1519efa20c42bcd52" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_885283e0709e1a736ecca80cf3c" FOREIGN KEY ("purchaseId") REFERENCES "purchase"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_6bc4d92ea5571b15834bf5d51ca" FOREIGN KEY ("buyerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7" FOREIGN KEY ("buyerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_8a583acc24e13bcf84b1b9d0d20" FOREIGN KEY ("sellerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_51d763d09be101daf17ed095233" FOREIGN KEY ("purchaseId") REFERENCES "purchase"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_904370c093ceea4369659a3c810" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_ab40a6f0cd7d3ebfcce082131fd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_dba55ed826ef26b5b22bd39409b" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "FK_e3130a39c1e4a740d044e685730" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "FK_72e80be86cab0e93e67ed1a7a9a" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "FK_72e80be86cab0e93e67ed1a7a9a"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "FK_e3130a39c1e4a740d044e685730"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_dba55ed826ef26b5b22bd39409b"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_ab40a6f0cd7d3ebfcce082131fd"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_904370c093ceea4369659a3c810"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_51d763d09be101daf17ed095233"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_8a583acc24e13bcf84b1b9d0d20"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_6bc4d92ea5571b15834bf5d51ca"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_885283e0709e1a736ecca80cf3c"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_cbb5d890de1519efa20c42bcd52"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`);
        await queryRunner.query(`DROP TABLE "role_permission"`);
        await queryRunner.query(`DROP TABLE "user_role"`);
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
        await queryRunner.query(`DROP TABLE "purchase"`);
        await queryRunner.query(`DROP TYPE "public"."purchase_status_enum"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TYPE "public"."payment_status_enum"`);
        await queryRunner.query(`DROP TABLE "product_category"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8992dd65608730f9b3922e5278"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ff0c0301a95e517153df97f681"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
