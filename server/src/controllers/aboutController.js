import db from "../config/db.js";

export const getAbout = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        heading,
        description,
        education,
        experience,
        location,
        profile_image
      FROM about
      WHERE is_active = TRUE
      ORDER BY id ASC
      LIMIT 1`
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "About content not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Get about error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch about content",
    });
  }
};

export const updateAbout = async (req, res) => {
  try {
    const {
      heading,
      description,
      education,
      experience,
      location,
      profile_image,
    } = req.body;

    if (!heading || !description) {
      return res.status(400).json({
        success: false,
        message: "Heading and description are required",
      });
    }

    const [existingRows] = await db.query(
      `SELECT id
       FROM about
       WHERE is_active = TRUE
       ORDER BY id ASC
       LIMIT 1`
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Active about content not found",
      });
    }

    const aboutId = existingRows[0].id;

    await db.query(
      `UPDATE about
       SET
        heading = ?,
        description = ?,
        education = ?,
        experience = ?,
        location = ?,
        profile_image = ?
       WHERE id = ?`,
      [
        heading.trim(),
        description.trim(),
        education?.trim() || null,
        experience?.trim() || null,
        location?.trim() || null,
        profile_image?.trim() || null,
        aboutId,
      ]
    );

    const [updatedRows] = await db.query(
      `SELECT
        id,
        heading,
        description,
        education,
        experience,
        location,
        profile_image
      FROM about
      WHERE id = ?
      LIMIT 1`,
      [aboutId]
    );

    res.json({
      success: true,
      message: "About content updated successfully",
      data: updatedRows[0],
    });
  } catch (error) {
    console.error("Update about error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update about content",
    });
  }
};
