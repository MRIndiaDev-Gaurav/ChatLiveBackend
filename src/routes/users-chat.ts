import { Router } from "express";
import { getMessages, sendMessage } from "../controllers/user.controller";
import { authenticateUser } from "../middleware/auth.middleware";
const router = Router();

router.use(authenticateUser);
router.post("/send", sendMessage);
router.get("/messages/:recipientId", getMessages);

export default router;
