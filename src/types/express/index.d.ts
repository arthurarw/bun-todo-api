import type { UserEntity } from "@/entities/user-entity";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<UserEntity, "id" | "email" | "created_at" | "updated_at">;
      sessionToken?: string;
    }
  }
}

export { };
