import express from "express";

import {
  loginAdmin,
  getCurrentAdmin,
  logoutAdmin,
} from "../controllers/adminController.js";

import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);

router.get("/me", requireAdmin, getCurrentAdmin);

router.post("/logout", logoutAdmin);

export default router;