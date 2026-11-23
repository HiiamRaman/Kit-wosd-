import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./Model/connectDB.js";
import express from "express";

import router from "./routes/routes.js";
import cors from "cors";
import seed from "./Model/seeds/seeds.js";

const app = express();

app.use(cors());
app.use(express.json());


app.post("/debug-register", (req, res) => {
  console.log("🔥 DIRECT POST ROUTE HIT");
  res.json({ message: "Direct route works" });
});





app.use("/api", router);
connectDB();
seed();

app.get("/api/hello", (_, res) => {
  res.json({
    message: "Hello Express!",
  });
});
app.get("/wallet", (req, res) => {
  console.log(req.params || req.body);
  return res.status(200).json({ message: "OK" });
});
app.post("/wallet", (req, res) => {
  console.log(req.params || req.body);
  return res.status(200).json({ message: "OK" });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
