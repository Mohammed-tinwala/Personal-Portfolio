import express from "express";

import {
  getExperience,
  getAllExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experienceController.js";

import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================
   PUBLIC
========================================= */

router.get("/", getExperience);

/* =========================================
   ADMIN
========================================= */

router.get("/all", requireAdmin, getAllExperience);

router.post("/", requireAdmin, createExperience);

router.put("/:id", requireAdmin, updateExperience);

router.delete("/:id", requireAdmin, deleteExperience);

export default router;
