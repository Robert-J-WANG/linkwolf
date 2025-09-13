import dotenv from "dotenv";

dotenv.config({ path: "../env/.env.development" });

export const config = {
  port: process.env.BACKEND_PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
};
