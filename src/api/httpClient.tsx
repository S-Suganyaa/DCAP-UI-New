import axios from "axios";

const httpClient = axios.create({
  baseURL: "https://localhost:44363/api",
  withCredentials: true // REQUIRED for AD cookies
});

export default httpClient;
