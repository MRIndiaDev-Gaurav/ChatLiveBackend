import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("groups route");
});

export default router;
