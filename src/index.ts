import express, { Application } from "express";

const app: Application = express();
const port = "3000";

app.get("/health", (req, res) => {
  console.log("Response sent");
  return res.json({ data: "OK" }).status(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
