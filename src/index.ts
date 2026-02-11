import express, { Application } from "express";
import { prisma } from "./lib/prisma.js";

const app: Application = express();
const port = "3000";

app.use(express.json());

app.get("/health", (req, res) => {
  return res.json({ data: "OK" }).status(200);
});

app.get("/test-item", async (req, res) => {
  const allTestItems = await prisma.testItem.findMany();
  console.log("All test items:", JSON.stringify(allTestItems, null, 2));
  return res.json({ data: allTestItems }).status(200);
});

app.post("/test-item", async (req, res) => {
  const text = req.body?.text;
  if (typeof text != "string") {
    return res.json({ msg: "invalid text field, must be string" }).status(400);
  }

  await prisma.testItem.create({
    data: {
      text: text
    }
  });
  return res.json({ data: "ok" }).status(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
