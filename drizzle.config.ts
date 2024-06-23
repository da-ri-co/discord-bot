import dotenv from "dotenv";
import {defineConfig} from "drizzle-kit";

dotenv.config();

export default defineConfig({
    dialect: "pg",
    schema: "./src/transcribe/schema.ts",
    out: "./db",
    dbCredentials: {
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "password",
        host: String(process.env.DB_HOST) || "localhost",
        port: Number(process.env.DB_PORT) || 3306,
        database: String(process.env.DB_NAME || "sample-project-development"),
    },
});
