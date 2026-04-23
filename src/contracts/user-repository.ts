import type { UserEntity } from "@/entities/user-entity";

export interface CreateUserInput {
  id: string;
  email: string;
  password_hash: string;
}

export interface IUserRepository {
  create(input: CreateUserInput): UserEntity;
  findByEmail(email: string): UserEntity | null;
  findById(id: string): UserEntity | null;
}
