import { Router } from "express";
import { prisma } from "../../lib/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  const products = await prisma.product.findMany({
    take: 20, // TODO: implement pagination
  });

  return res.json({ data: products }).status(200);
});

export default router;
