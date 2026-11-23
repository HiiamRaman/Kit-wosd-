import Transaction from "../Model/trasnaction.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../Model/user.js";
import verify from "../utils/verify.js";
export const getUser = asyncHandler(async (req, res) => {
  const userParam = req.param.username;
  console.log(req?.body || req?.params);
  if (!userParam) throw Error("Insufficient param");
  const user = await User.find({ username: userParam });
  console.log(userParam);
  if (!user) throw Error("User unavailable");
  return res.status(200).json({
    username: userParam,
    balance: user?.balance,
    currency: user?.currency,
  });
});

export const balance = asyncHandler(async (req, res) => {
  const { username, amount, game, game_category, transaction_id, signature } =
    req.body;
  const verifySignature = verify(
    {
      username,
      amount,
      game,
      game_category,
      transaction_id,
    },
    process.env.API_KEY,
  );
  //add verification layer
  const user = await User.findOne({ username });
  console.log(user);
  const newBalance = (user.balance || 0) + amount;

  if (!user) throw Error("User not found");
  const transaction = await Transaction.create({
    username,
    amount,
    transaction_id,
    balance: user.balance || 0,
    game,
    game_category,
    user: user?._id,
  });
  user.balance = newBalance;
  await user.save();
  return res.status(200).json({ balance: newBalance });
});
