import { asyncHandler } from "../utils/asyncHandler.js";
import API from "../utils/API.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const cache = {
  data: [],
  exp: Date.now() + 1000 * 60 * 60 * 48,
};

const session = {};

const rehydrate = async () => {
  if (cache.data.length <= 0 || cache.exp < Date.now()) {
    const response = await API.get("/games/?limit=2000", {
      headers: {
        "X-API-Key": process.env.API_KEY,
        "Content-Type": "application/json",
      },
    });

    cache.data = response?.data?.data;
    cache.exp = Date.now() + 1000 * 60 * 60;
  }
};

export const getGames = asyncHandler(async (req, res) => {
  await rehydrate();
  const start = parseInt(req.query.start) || 0;
  const maxLim = 10;
  const limit = parseInt(req.query.limit) || maxLim - 1;

  return res.status(200).json({
    data: cache.data.filter((element, idx) => {
      return idx >= start && idx <= start + Math.min(maxLim, limit);
    }),
  });
});

export const getGamesById = asyncHandler(async (req, res) => {
  await rehydrate();
  const { id } = req.params;

  return res.status(200).json({
    data: cache.data.find((x) => x?.id == id),
  });
});
export const gameLaunch = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user_token = crypto.randomUUID().toString;
  session[user_token.toString()] = req.user.id;

  const response = await API.post(
    "/games/launch",
    {
      game_id: parseInt(id),
      user_token: req.user?.user_token,
      currency: "USD",
      return_url: "https://www.google.com",
    },
    {
      headers: {
        "X-API-Key": process.env.API_KEY,
        "Content-Type": "application/json",
      },
    },
  );

  console.log(typeof response, response.data.success);
  if (response?.data?.success === true) {
    return res.status(200).json({
      data: response.data,
    });
  }
  throw new Error("Err");
});
