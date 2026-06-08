import axios from "axios";

const API = axios.create({
  baseURL: "https://real-time-chat-app-bvyi.onrender.com/api",
});

export default API;