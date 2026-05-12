import { env } from "@/config/env";
import type { ISessionRepository } from "@/contracts/session-repository";
import type { UserEntity } from "@/entities/user-entity";
import { v7 as uuidv7 } from "uuid";
import { signJwt } from "../../utils/jwt.helper";

export type PublicUser = Pick<UserEntity, "id" | "email" | "created_at" | "updated_at">;

export interface AuthSessionOutput {
  token: string;
  user: PublicUser;
}

export function toPublicUser(user: UserEntity): PublicUser {
  return {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
}

export async function createSession(
  sessionRepository: ISessionRepository,
  user: UserEntity
): Promise<AuthSessionOutput> {
  const token = await signJwt({ sub: user.id, email: user.email });
  const expiresAt = new Date(Date.now() + env.SESSION_TTL_HOURS * 60 * 60 * 1000).toISOString();

  sessionRepository.create({
    id: uuidv7(),
    user_id: user.id,
    token,
    expires_at: expiresAt
  });

  return { token, user: toPublicUser(user) };
}
