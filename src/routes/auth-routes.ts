import type { AuthController } from "@/controllers/auth-controller";
import { createAuthMiddleware } from "@/middlewares/auth-middleware";
import type { AuthService } from "@/services/auth-service";
import { Router } from "express";

export function createAuthRoutes(authController: AuthController, authService: AuthService): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(authService);

  router.post("/register", authController.register);
  router.post("/login", authController.login);
  router.post("/logout", authMiddleware, authController.logout);
  router.get("/me", authMiddleware, authController.me);

  return router;
}
