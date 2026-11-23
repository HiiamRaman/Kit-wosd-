import express from "express";
import { authMiddlware } from "../middleware/authMiddleware.js";
import {
  getGames,
  getGamesById,
  gameLaunch,
} from "../Controller/betController.js";
const router = express.Router();

router.get("/", getGames);
router.get("/:id", getGamesById);
router.get("/launch/:id", authMiddlware(["user", "admin"]), gameLaunch);

export default router;
