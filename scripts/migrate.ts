import { env } from "@/config/env";
import { Database } from "bun:sqlite";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { v7 as uuidv7 } from "uuid";

interface MigrationRecord {
  name: string;
}

async function runMigrations(): Promise<void> {
  const database = new Database(env.DATABASE_PATH, { create: true });
  database.run("PRAGMA foreign_keys = ON;");

  database.run(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      executed_at TEXT NOT NULL
    )
  `);

  const migrationsDirectory = path.resolve(process.cwd(), "migrations");
  const files = (await readdir(migrationsDirectory))
    .filter((file) => file.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));

  const appliedMigrations = new Set(
    (
      database
        .query("SELECT name FROM schema_migrations")
        .all() as MigrationRecord[]
    ).map((migration) => migration.name)
  );

  for (const file of files) {
    if (appliedMigrations.has(file)) {
      continue;
    }

    const sql = await readFile(path.join(migrationsDirectory, file), "utf-8");
    const executedAt = new Date().toISOString();

    database.transaction(() => {
      database.run(sql);
      database
        .query("INSERT INTO schema_migrations (id, name, executed_at) VALUES (?, ?, ?)")
        .run(uuidv7(), file, executedAt);
    })();

    // eslint-disable-next-line no-console
    console.log(`Migração aplicada: ${file}`);
  }

  database.close();
}

runMigrations().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Erro ao executar migrações:", error);
  process.exit(1);
});
