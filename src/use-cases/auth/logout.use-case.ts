import type { ISessionRepository } from "@/contracts/session-repository";

export class LogoutUseCase {
  constructor(private readonly sessionRepository: ISessionRepository) { }

  execute(sessionToken: string): void {
    this.sessionRepository.deleteByToken(sessionToken);
  }
}
