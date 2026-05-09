import { AuthController } from "@/controllers/auth-controller";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { Router } from "express";

export function createAuthRoutes(): Router {
  const router = Router();
  const authController = new AuthController();

  router.post("/register", authController.register);
  router.post("/login", authController.login);
  router.post("/logout", authMiddleware, authController.logout);
  router.get("/me", authMiddleware, authController.me);

  return router;
}
