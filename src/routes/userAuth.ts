import { Router } from "express";
import {
  login,
  refreshToken,
  userRegister,
  verifyEmail,
} from "../controllers/auth.controller";
import rateLimit from "express-rate-limit";

const router = Router();

rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: "Too many login attempts, please try again after 20 minutes",
});

router.post("/register", userRegister);
router.get("/verify:token", verifyEmail);
router.post("/login", login);
router.post("/refreshToken", refreshToken);

export default router;
