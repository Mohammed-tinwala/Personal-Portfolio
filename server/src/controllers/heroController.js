import db from "../config/db.js";

export const getHero = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        name,
        headline,
        description,
        primary_button_text,
        primary_button_url,
        secondary_button_text,
        secondary_button_url
      FROM hero
      WHERE is_active = TRUE
      ORDER BY id ASC
      LIMIT 1`
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hero content not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Get hero error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch hero content",
    });
  }
};

export const updateHero = async (req, res) => {
  try {
    const {
      name,
      headline,
      description,
      primary_button_text,
      primary_button_url,
      secondary_button_text,
      secondary_button_url,
    } = req.body;

    if (!name || !headline || !description) {
      return res.status(400).json({
        success: false,
        message: "Name, headline and description are required",
      });
    }

    const [existingRows] = await db.query(
      `SELECT id
       FROM hero
       WHERE is_active = TRUE
       ORDER BY id ASC
       LIMIT 1`
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Active hero content not found",
      });
    }

    const heroId = existingRows[0].id;

    await db.query(
      `UPDATE hero
       SET
        name = ?,
        headline = ?,
        description = ?,
        primary_button_text = ?,
        primary_button_url = ?,
        secondary_button_text = ?,
        secondary_button_url = ?
       WHERE id = ?`,
      [
        name.trim(),
        headline.trim(),
        description.trim(),
        primary_button_text?.trim() || null,
        primary_button_url?.trim() || null,
        secondary_button_text?.trim() || null,
        secondary_button_url?.trim() || null,
        heroId,
      ]
    );

    const [updatedRows] = await db.query(
      `SELECT
        id,
        name,
        headline,
        description,
        primary_button_text,
        primary_button_url,
        secondary_button_text,
        secondary_button_url
      FROM hero
      WHERE id = ?
      LIMIT 1`,
      [heroId]
    );

    res.json({
      success: true,
      message: "Hero content updated successfully",
      data: updatedRows[0],
    });
  } catch (error) {
    console.error("Update hero error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update hero content",
    });
  }
};