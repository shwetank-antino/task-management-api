import express from "express";

import authRoutes from "../../v1/components/auth/auth.routes.js";
import userRoutes from "../../v1/components/users/users.routes.js";
import taskRoutes from "../../v1/components/tasks/tasks.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);

export default router;