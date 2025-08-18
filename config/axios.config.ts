import axios from "axios";

// const baseURL = process.env.NEXT_PUBLIC_SITE_URL;
const baseURL = 'http://34.67.41.175/backend/1.0';

export const api = axios.create({
  baseURL,
});
