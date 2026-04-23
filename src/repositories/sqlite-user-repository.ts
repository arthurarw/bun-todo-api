import type { CreateUserInput, IUserRepository } from "@/contracts/user-repository";
import type { UserEntity } from "@/entities/user-entity";
import type { Database } from "bun:sqlite";

export class SqliteUserRepository implements IUserRepository {
  constructor(private readonly database: Database) { }

  create(input: CreateUserInput): UserEntity {
    const now = new Date().toISOString();
    this.database
      .query(
        `
        INSERT INTO users (id, email, password_hash, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `
      )
      .run(input.id, input.email, input.password_hash, now, now);

    const user = this.findById(input.id);
    if (!user) {
      throw new Error("Falha ao criar usuário.");
    }

    return user;
  }

  findByEmail(email: string): UserEntity | null {
    const row = this.database
      .query("SELECT id, email, password_hash, created_at, updated_at FROM users WHERE email = ?")
      .get(email) as UserEntity | null;

    return row ?? null;
  }

  findById(id: string): UserEntity | null {
    const row = this.database
      .query("SELECT id, email, password_hash, created_at, updated_at FROM users WHERE id = ?")
      .get(id) as UserEntity | null;

    return row ?? null;
  }
}
