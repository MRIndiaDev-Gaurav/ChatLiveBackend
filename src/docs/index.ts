import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import userSpec from "./swagger-user";
import adminSpec from "./swagger-admin";

const router = Router();

// User Endpoints
router.use(
  "/user",
  swaggerUi.serve,
  swaggerUi.setup(userSpec, {
    explorer: true,
    customSiteTitle: "User API Documentation",
  })
);

// Admin Endpoints
router.use(
  "/admin",
  swaggerUi.serve,
  swaggerUi.setup(adminSpec, {
    explorer: true,
    customSiteTitle: "Admin API Documentation",
  })
);

export default router;
