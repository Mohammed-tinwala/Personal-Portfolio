import express from "express";

import {
  createContactMessage,
  getContactMessages,
  markContactMessageAsRead,
  markContactMessageAsUnread,
  deleteContactMessage,
} from "../controllers/contactController.js";

import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post("/", createContactMessage);

// Admin
router.get("/", requireAdmin, getContactMessages);
router.put("/:id/read", requireAdmin, markContactMessageAsRead);
router.put("/:id/unread", requireAdmin, markContactMessageAsUnread);
router.delete("/:id", requireAdmin, deleteContactMessage);

export default router;
