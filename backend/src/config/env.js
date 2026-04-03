import dotenv from "dotenv";

dotenv.config();

export const env = {
    DB_URI: process.env.DB_URI,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    SERVE_FRONTEND: process.env.SERVE_FRONTEND,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    JSON_LIMIT: process.env.JSON_LIMIT,
    URLENCODED_LIMIT: process.env.URLENCODED_LIMIT,
    RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
    RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX,
}