import db from "../config/db.js";

const normalizeTechnologies = (technologies) => {
  if (Array.isArray(technologies)) {
    return technologies
      .map((technology) => String(technology).trim())
      .filter(Boolean);
  }

  if (typeof technologies === "string") {
    return technologies
      .split(",")
      .map((technology) => technology.trim())
      .filter(Boolean);
  }

  return [];
};

export const getProjects = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        title,
        description,
        image,
        technologies,
        live_url,
        github_url,
        category,
        is_featured,
        sort_order
      FROM projects
      WHERE is_active = TRUE
      ORDER BY sort_order ASC, id ASC`
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        title,
        description,
        image,
        technologies,
        live_url,
        github_url,
        category,
        is_featured,
        sort_order,
        is_active
      FROM projects
      ORDER BY sort_order ASC, id ASC`
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Get all projects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch all projects",
    });
  }
};

export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      technologies,
      live_url,
      github_url,
      category,
      is_featured,
      sort_order,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Project title and description are required",
      });
    }

    const normalizedTechnologies =
      normalizeTechnologies(technologies);

    const [result] = await db.query(
      `INSERT INTO projects
        (
          title,
          description,
          image,
          technologies,
          live_url,
          github_url,
          category,
          is_featured,
          sort_order,
          is_active
        )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [
        title.trim(),
        description.trim(),
        image?.trim() || null,
        JSON.stringify(normalizedTechnologies),
        live_url?.trim() || null,
        github_url?.trim() || null,
        category?.trim() || null,
        is_featured ? 1 : 0,
        Number(sort_order) || 0,
      ]
    );

    const [rows] = await db.query(
      `SELECT
        id,
        title,
        description,
        image,
        technologies,
        live_url,
        github_url,
        category,
        is_featured,
        sort_order,
        is_active
      FROM projects
      WHERE id = ?
      LIMIT 1`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("Create project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create project",
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      image,
      technologies,
      live_url,
      github_url,
      category,
      is_featured,
      sort_order,
      is_active,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Project title and description are required",
      });
    }

    const [existingRows] = await db.query(
      `SELECT id
       FROM projects
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const normalizedTechnologies =
      normalizeTechnologies(technologies);

    await db.query(
      `UPDATE projects
       SET
        title = ?,
        description = ?,
        image = ?,
        technologies = ?,
        live_url = ?,
        github_url = ?,
        category = ?,
        is_featured = ?,
        sort_order = ?,
        is_active = ?
       WHERE id = ?`,
      [
        title.trim(),
        description.trim(),
        image?.trim() || null,
        JSON.stringify(normalizedTechnologies),
        live_url?.trim() || null,
        github_url?.trim() || null,
        category?.trim() || null,
        is_featured ? 1 : 0,
        Number(sort_order) || 0,
        is_active ? 1 : 0,
        id,
      ]
    );

    const [updatedRows] = await db.query(
      `SELECT
        id,
        title,
        description,
        image,
        technologies,
        live_url,
        github_url,
        category,
        is_featured,
        sort_order,
        is_active
      FROM projects
      WHERE id = ?
      LIMIT 1`,
      [id]
    );

    res.json({
      success: true,
      message: "Project updated successfully",
      data: updatedRows[0],
    });
  } catch (error) {
    console.error("Update project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingRows] = await db.query(
      `SELECT id
       FROM projects
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await db.query(
      `DELETE FROM projects
       WHERE id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
};
