import axios from "axios";
import { authorization } from "@/api/interceptors";

const baseURL = ((env: string): string => {
  switch (env) {
    case "development":
      return "http://localhost:9000/api/v0";
    default:
      throw new Error(`unexpected environment type: ${env}`);
  }
})(process.env.NODE_ENV);

const headers = {
  "Content-Type": "application/json"
};

const api = axios.create({ baseURL, headers });

api.interceptors.request.use(authorization);

export { api };
