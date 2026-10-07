import express from "express";

import {
  getProjects,
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectsController.js";

import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getProjects);

// Admin
router.get("/all", requireAdmin, getAllProjects);
router.post("/", requireAdmin, createProject);
router.put("/:id", requireAdmin, updateProject);
router.delete("/:id", requireAdmin, deleteProject);

export default router;