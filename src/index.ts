import "dotenv/config";
import cors from "cors";
import express, { Application } from "express";
import { pinoHttp } from "pino-http";

import productRouter from "./features/product/routes.js";
import authRouter from "./features/auth/routes.js";
import categoryRouter from "./features/category/routes.js";
import purchaseRouter from "./features/purchase/routes.js";
import paymentRouter from "./features/payment/routes.js";
import { prisma } from "./lib/prisma.js";
import logger from "./lib/logger.js";

const app: Application = express();
const port = process.env.PORT || "3000";

app.use(express.json());
app.use(cors());
app.use(
  pinoHttp({
    logger,
    autoLogging: {
      ignore: (req) => req.url === "/health" || req.url === "/ready",
    },
  }),
);

app.get("/health", (req, res) => {
  return res.status(200).json({ status: "ok" });
});

app.get("/ready", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "ready" });
  } catch {
    res.status(503).json({ status: "unavailable" });
  }
});

app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/purchases", purchaseRouter);
app.use("/payments", paymentRouter);

app.listen(port, () => {
  logger.info({ port }, "Server started");
});
