import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});
//abc
export default API;