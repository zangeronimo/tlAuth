import dotenv from "dotenv";
import { execSync } from "child_process";

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: envFile });
const decoded = Buffer.from(process.env.POSTGRES_URL, "base64").toString(
  "utf-8"
);
process.env.DATABASE_URL = decoded;

execSync(`node-pg-migrate ${process.argv.slice(2).join(" ")}`, {
  stdio: "inherit",
});
