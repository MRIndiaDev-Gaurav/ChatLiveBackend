import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("admin route");
});

export default router;
