import { Router } from "express";
import {
  createGroup,
  getAllGroup,
  joinGroup,
  leaveGroup,
} from "../controllers/group.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateUser);
router.post("/create", createGroup);
router.get("/all", getAllGroup);
router.post("/:groupId/join", joinGroup);
router.post("/:groupId/leave", leaveGroup);

export default router;
