import crypto from "crypto";

export default function sign(p, apiKey) {
  const base =
    p.username + p.amount + p.game + p.game_category + p.transaction_id;
  return crypto.createHmac("sha256", apiKey).update(base).digest("hex");
}
