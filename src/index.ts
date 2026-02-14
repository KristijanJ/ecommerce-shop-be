import cors from "cors";
import express, { Application } from "express";

import productRouter from "./features/product/routes.js";

const app: Application = express();
const port = "3000";

app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  return res.json({ data: "OK" }).status(200);
});

app.use("/products", productRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
