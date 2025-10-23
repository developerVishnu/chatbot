import "../config/dotenv.js"
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL ? process.env.DATABASE_URL : "");
