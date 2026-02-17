import * as z from "zod";

export const PurchaseSchema = z.object({});

export const PurchaseItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1, "Quantity must be at least 1."),
});

export const CreatePurchaseSchema = z.object({
  items: z.array(PurchaseItemSchema).min(1, "At least one item is required."),
});

export type ICreatePurchaseItem = z.infer<typeof PurchaseItemSchema>;
export type ICreatePurchase = z.infer<typeof CreatePurchaseSchema>;