import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import db from "./config/db.js";

import siteSettingsRoutes from "./routes/siteSettingsRoutes.js";
import heroRoutes from "./routes/heroRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import skillsRoutes from "./routes/skillsRoutes.js";
import projectsRoutes from "./routes/projectsRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import educationRoutes from "./routes/educationRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://personal-portfolio-teal-five-99.vercel.app",
    ],
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());


app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Portfolio API is running",
  });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS database_connected");
    
    res.json({
      success: true,
      message: "MySQL database connected successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.use("/api/site-settings", siteSettingsRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/contact", contactRoutes);


app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);




app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
