import express from "express";
import { getUser, balance } from "../Controller/walletController.js";
const router = express.Router();

router.get("/user", getUser);
router.post("/balance", balance);

export default router;
