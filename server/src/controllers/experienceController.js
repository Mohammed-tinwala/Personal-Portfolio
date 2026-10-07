import db from "../config/db.js";

/* =========================================
   TECHNOLOGIES HELPER
========================================= */

const normalizeTechnologies = (technologies) => {
  if (Array.isArray(technologies)) {
    return technologies
      .map((technology) => String(technology).trim())
      .filter(Boolean);
  }

  if (typeof technologies === "string") {
    try {
      const parsed = JSON.parse(technologies);

      if (Array.isArray(parsed)) {
        return parsed
          .map((technology) => String(technology).trim())
          .filter(Boolean);
      }
    } catch {
      return technologies
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean);
    }
  }

  return [];
};

/* =========================================
   FORMAT EXPERIENCE
========================================= */

const formatExperience = (rows) => {
  return rows.map((item) => ({
    ...item,
    technologies: normalizeTechnologies(item.technologies),
    is_current: Boolean(item.is_current),
    is_active: Boolean(item.is_active),
  }));
};

/* =========================================
   GET ACTIVE EXPERIENCE
========================================= */

export const getExperience = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        company_name,
        job_title,
        location,
        employment_type,
        start_date,
        end_date,
        is_current,
        description,
        technologies,
        company_url,
        sort_order
      FROM experience
      WHERE is_active = TRUE
      ORDER BY sort_order ASC, start_date DESC, id DESC`
    );

    res.json({
      success: true,
      data: formatExperience(rows),
    });
  } catch (error) {
    console.error("Get experience error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch experience",
    });
  }
};

/* =========================================
   GET ALL EXPERIENCE - ADMIN
========================================= */

export const getAllExperience = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        company_name,
        job_title,
        location,
        employment_type,
        start_date,
        end_date,
        is_current,
        description,
        technologies,
        company_url,
        sort_order,
        is_active
      FROM experience
      ORDER BY sort_order ASC, start_date DESC, id DESC`
    );

    res.json({
      success: true,
      data: formatExperience(rows),
    });
  } catch (error) {
    console.error("Get all experience error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch all experience",
    });
  }
};

/* =========================================
   CREATE EXPERIENCE
========================================= */

export const createExperience = async (req, res) => {
  try {
    const {
      company_name,
      job_title,
      location,
      employment_type,
      start_date,
      end_date,
      is_current,
      description,
      technologies,
      company_url,
      sort_order,
    } = req.body;

    if (
      !company_name ||
      !job_title ||
      !start_date ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Company name, job title, start date and description are required",
      });
    }

    const normalizedTechnologies =
      normalizeTechnologies(technologies);

    const [result] = await db.query(
      `INSERT INTO experience
        (
          company_name,
          job_title,
          location,
          employment_type,
          start_date,
          end_date,
          is_current,
          description,
          technologies,
          company_url,
          sort_order,
          is_active
        )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [
        company_name.trim(),
        job_title.trim(),
        location?.trim() || null,
        employment_type?.trim() || null,
        start_date,
        is_current ? null : end_date || null,
        is_current ? 1 : 0,
        description.trim(),
        JSON.stringify(normalizedTechnologies),
        company_url?.trim() || null,
        Number(sort_order) || 0,
      ]
    );

    const [rows] = await db.query(
      `SELECT
        id,
        company_name,
        job_title,
        location,
        employment_type,
        start_date,
        end_date,
        is_current,
        description,
        technologies,
        company_url,
        sort_order,
        is_active
      FROM experience
      WHERE id = ?
      LIMIT 1`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Experience created successfully",
      data: formatExperience(rows)[0],
    });
  } catch (error) {
    console.error("Create experience error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create experience",
    });
  }
};

/* =========================================
   UPDATE EXPERIENCE
========================================= */

export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      company_name,
      job_title,
      location,
      employment_type,
      start_date,
      end_date,
      is_current,
      description,
      technologies,
      company_url,
      sort_order,
      is_active,
    } = req.body;

    if (
      !company_name ||
      !job_title ||
      !start_date ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Company name, job title, start date and description are required",
      });
    }

    const [existingRows] = await db.query(
      `SELECT id
       FROM experience
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    const normalizedTechnologies =
      normalizeTechnologies(technologies);

    await db.query(
      `UPDATE experience
       SET
        company_name = ?,
        job_title = ?,
        location = ?,
        employment_type = ?,
        start_date = ?,
        end_date = ?,
        is_current = ?,
        description = ?,
        technologies = ?,
        company_url = ?,
        sort_order = ?,
        is_active = ?
       WHERE id = ?`,
      [
        company_name.trim(),
        job_title.trim(),
        location?.trim() || null,
        employment_type?.trim() || null,
        start_date,
        is_current ? null : end_date || null,
        is_current ? 1 : 0,
        description.trim(),
        JSON.stringify(normalizedTechnologies),
        company_url?.trim() || null,
        Number(sort_order) || 0,
        is_active ? 1 : 0,
        id,
      ]
    );

    const [updatedRows] = await db.query(
      `SELECT
        id,
        company_name,
        job_title,
        location,
        employment_type,
        start_date,
        end_date,
        is_current,
        description,
        technologies,
        company_url,
        sort_order,
        is_active
      FROM experience
      WHERE id = ?
      LIMIT 1`,
      [id]
    );

    res.json({
      success: true,
      message: "Experience updated successfully",
      data: formatExperience(updatedRows)[0],
    });
  } catch (error) {
    console.error("Update experience error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update experience",
    });
  }
};

/* =========================================
   DELETE EXPERIENCE
========================================= */

export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingRows] = await db.query(
      `SELECT id
       FROM experience
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    await db.query(
      `DELETE FROM experience
       WHERE id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error("Delete experience error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete experience",
    });
  }
};
