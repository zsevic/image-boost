import { isEnvironment } from "../utils";

export const API_BASE_URL =
  isEnvironment('development')
    ? 'http://localhost:8080'
    : 'https://image-boost-server.fly.dev';
