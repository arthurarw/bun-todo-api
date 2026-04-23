import { env } from "@/config/env";
import { Database } from "bun:sqlite";

const database = new Database(env.DATABASE_PATH, { create: true });
database.run("PRAGMA foreign_keys = ON;");

export function getDatabase(): Database {
  return database;
}
