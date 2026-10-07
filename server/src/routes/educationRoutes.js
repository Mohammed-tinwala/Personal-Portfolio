import express from "express";

import {
  getEducation,
  getAllEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from "../controllers/educationController.js";

import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getEducation);

// Admin
router.get("/all", requireAdmin, getAllEducation);
router.post("/", requireAdmin, createEducation);
router.put("/:id", requireAdmin, updateEducation);
router.delete("/:id", requireAdmin, deleteEducation);

export default router;
