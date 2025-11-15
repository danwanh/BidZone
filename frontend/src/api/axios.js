import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:3000", // your backend
  withCredentials: true, // required to send/receive httpOnly cookies
});
