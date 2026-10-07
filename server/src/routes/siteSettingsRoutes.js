import express from "express";

import {
  getSiteSettings,
  updateSiteSettings,
} from "../controllers/siteSettingsController.js";

import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getSiteSettings);

// Admin only
router.put("/", requireAdmin, updateSiteSettings);

export default router;