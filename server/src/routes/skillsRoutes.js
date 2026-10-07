import express from "express";

import {
  getSkills,
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillsController.js";

import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getSkills);

// Admin
router.get("/all", requireAdmin, getAllSkills);
router.post("/", requireAdmin, createSkill);
router.put("/:id", requireAdmin, updateSkill);
router.delete("/:id", requireAdmin, deleteSkill);

export default router;
