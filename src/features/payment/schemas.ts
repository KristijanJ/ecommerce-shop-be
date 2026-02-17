import * as z from "zod";

export const CreatePaymentSchema = z.object({
  purchaseId: z.number().int().positive(),
});

export type ICreatePayment = z.infer<typeof CreatePaymentSchema>;
