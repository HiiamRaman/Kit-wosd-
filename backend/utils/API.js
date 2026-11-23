import axios from "axios";

const API = axios.create({
  baseURL: "https://api.bigbangcasino.bet/api/v1",
});

export default API;
