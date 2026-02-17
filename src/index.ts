import "dotenv/config";
import cors from "cors";
import express, { Application } from "express";

import productRouter from "./features/product/routes.js";
import authRouter from "./features/auth/routes.js";
import categoryRouter from "./features/category/routes.js";
import purchaseRouter from "./features/purchase/routes.js";
import paymentRouter from "./features/payment/routes.js";

const app: Application = express();
const port = process.env.PORT || "3000";

app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  return res.json({ data: "OK" }).status(200);
});

app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/purchases", purchaseRouter);
app.use("/payments", paymentRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
