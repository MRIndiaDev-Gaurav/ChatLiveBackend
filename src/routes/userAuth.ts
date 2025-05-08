import { Router } from "express";
import {
  login,
  refreshToken,
  updateUser,
  userRegister,
  verifyEmail,
} from "../controllers/auth.controller";
import rateLimit from "express-rate-limit";

const router = Router();

router.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per windowMs
    message: "Too many login attempts, please try again after 20 minutes",
  })
);

router.post("/register", userRegister);
router.get("/verify", verifyEmail);
router.post("/login", login);
router.post("/refreshToken", refreshToken);
router.post("/update", updateUser);

export default router;
