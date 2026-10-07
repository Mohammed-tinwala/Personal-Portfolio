import express from "express";

import {
  getAbout,
  updateAbout,
} from "../controllers/aboutController.js";

import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAbout);
router.put("/", requireAdmin, updateAbout);

export default router;
