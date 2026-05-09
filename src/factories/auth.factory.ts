import { getDatabase } from "@/database/sqlite";
import { SqliteSessionRepository } from "@/repositories/sqlite-session-repository";
import { SqliteUserRepository } from "@/repositories/sqlite-user-repository";
import { GetSessionUserUseCase } from "@/use-cases/auth/get-session-user.use-case";
import { LoginUseCase } from "@/use-cases/auth/login.use-case";
import { LogoutUseCase } from "@/use-cases/auth/logout.use-case";
import { RegisterUseCase } from "@/use-cases/auth/register.use-case";



export function makeRegisterUseCase() {
  const database = getDatabase();
  const userRepository = new SqliteUserRepository(database);
  const sessionRepository = new SqliteSessionRepository(database);
  return new RegisterUseCase(userRepository, sessionRepository);
}

export function makeGetSessionUserUseCase() {
  const database = getDatabase();
  const userRepository = new SqliteUserRepository(database);
  const sessionRepository = new SqliteSessionRepository(database);
  return new GetSessionUserUseCase(userRepository, sessionRepository);
}

export function makeLoginUserUseCase() {
  const database = getDatabase();
  const userRepository = new SqliteUserRepository(database);
  const sessionRepository = new SqliteSessionRepository(database);
  return new LoginUseCase(userRepository, sessionRepository);
}

export function makeLogoutUserUseCase() {
  const database = getDatabase();
  const sessionRepository = new SqliteSessionRepository(database);
  return new LogoutUseCase(sessionRepository);
}
