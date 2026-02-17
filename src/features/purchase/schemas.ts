import * as z from "zod";

export const PurchaseSchema = z.object({});

// id       Int            @id @default(autoincrement())
// orders   Order[]
// buyer    User           @relation(fields: [buyerId], references: [id])
// buyerId  Int
// status   PurchaseStatus @default(PENDING)
// payments Payment[]