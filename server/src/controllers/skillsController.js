import db from "../config/db.js";

export const getSkills = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        name,
        category,
        icon,
        sort_order
      FROM skills
      WHERE is_active = TRUE
      ORDER BY sort_order ASC, id ASC`
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Get skills error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch skills",
    });
  }
};

export const getAllSkills = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        name,
        category,
        icon,
        sort_order,
        is_active
      FROM skills
      ORDER BY sort_order ASC, id ASC`
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Get all skills error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch all skills",
    });
  }
};

export const createSkill = async (req, res) => {
  try {
    const {
      name,
      category,
      icon,
      sort_order,
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Skill name and category are required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO skills
        (name, category, icon, sort_order, is_active)
       VALUES (?, ?, ?, ?, TRUE)`,
      [
        name.trim(),
        category.trim(),
        icon?.trim() || null,
        Number(sort_order) || 0,
      ]
    );

    const [rows] = await db.query(
      `SELECT
        id,
        name,
        category,
        icon,
        sort_order,
        is_active
      FROM skills
      WHERE id = ?
      LIMIT 1`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("Create skill error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create skill",
    });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      category,
      icon,
      sort_order,
      is_active,
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Skill name and category are required",
      });
    }

    const [existingRows] = await db.query(
      `SELECT id
       FROM skills
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    await db.query(
      `UPDATE skills
       SET
        name = ?,
        category = ?,
        icon = ?,
        sort_order = ?,
        is_active = ?
       WHERE id = ?`,
      [
        name.trim(),
        category.trim(),
        icon?.trim() || null,
        Number(sort_order) || 0,
        is_active ? 1 : 0,
        id,
      ]
    );

    const [updatedRows] = await db.query(
      `SELECT
        id,
        name,
        category,
        icon,
        sort_order,
        is_active
      FROM skills
      WHERE id = ?
      LIMIT 1`,
      [id]
    );

    res.json({
      success: true,
      message: "Skill updated successfully",
      data: updatedRows[0],
    });
  } catch (error) {
    console.error("Update skill error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update skill",
    });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingRows] = await db.query(
      `SELECT id
       FROM skills
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    await db.query(
      `DELETE FROM skills
       WHERE id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Delete skill error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete skill",
    });
  }
};
