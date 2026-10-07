import express from "express";

import {
  getHero,
  updateHero,
} from "../controllers/heroController.js";

import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getHero);

// Admin only
router.put("/", requireAdmin, updateHero);

export default router;