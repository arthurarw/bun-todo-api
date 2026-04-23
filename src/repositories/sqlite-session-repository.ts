import type { CreateSessionInput, ISessionRepository } from "@/contracts/session-repository";
import type { SessionEntity } from "@/entities/session-entity";
import type { Database } from "bun:sqlite";

export class SqliteSessionRepository implements ISessionRepository {
  constructor(private readonly database: Database) { }

  create(input: CreateSessionInput): SessionEntity {
    const now = new Date().toISOString();
    this.database
      .query(
        `
        INSERT INTO sessions (id, user_id, token, expires_at, created_at)
        VALUES (?, ?, ?, ?, ?)
      `
      )
      .run(input.id, input.user_id, input.token, input.expires_at, now);

    const session = this.findByToken(input.token);
    if (!session) {
      throw new Error("Falha ao criar sessão.");
    }

    return session;
  }

  findByToken(token: string): SessionEntity | null {
    const row = this.database
      .query("SELECT id, user_id, token, expires_at, created_at FROM sessions WHERE token = ?")
      .get(token) as SessionEntity | null;

    return row ?? null;
  }

  deleteByToken(token: string): void {
    this.database.query("DELETE FROM sessions WHERE token = ?").run(token);
  }
}
