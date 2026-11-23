import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.API_KEY;

const res = await fetch("https://api.bigbangcasino.bet/api/v1/users/abcd", {
  method: "GET",
  headers: {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json",
  },
  // body: JSON.stringify({
  //   user_token: "abcd",
  //   amount: 100,
  //   transaction_id: 10,
  //   sandbox: true,
  // }),
});

const data = await res.json();
console.log(data);
