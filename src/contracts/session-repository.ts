import type { SessionEntity } from "@/entities/session-entity";

export interface CreateSessionInput {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
}

export interface ISessionRepository {
  create(input: CreateSessionInput): SessionEntity;
  findByToken(token: string): SessionEntity | null;
  deleteByToken(token: string): void;
}
