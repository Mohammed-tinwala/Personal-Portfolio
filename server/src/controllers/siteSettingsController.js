import db from "../config/db.js";

export const getSiteSettings = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        site_name,
        site_title,
        site_description,
        email,
        phone,
        location,
        github_url,
        linkedin_url,
        resume_url,
        availability_status
      FROM site_settings
      ORDER BY id ASC
      LIMIT 1`
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Site settings not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Get site settings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch site settings",
    });
  }
};

export const updateSiteSettings = async (req, res) => {
  try {
    const {
      site_name,
      site_description,
      email,
      phone,
      location,
      github_url,
      linkedin_url,
    } = req.body;

    if (!site_name || !site_description || !email) {
      return res.status(400).json({
        success: false,
        message: "Site name, description and email are required",
      });
    }

    const [existingRows] = await db.query(
      `SELECT id
       FROM site_settings
       ORDER BY id ASC
       LIMIT 1`
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Site settings not found",
      });
    }

    const settingsId = existingRows[0].id;

    await db.query(
      `UPDATE site_settings
       SET
         site_name = ?,
         site_description = ?,
         email = ?,
         phone = ?,
         location = ?,
         github_url = ?,
         linkedin_url = ?
       WHERE id = ?`,
      [
        site_name.trim(),
        site_description.trim(),
        email.trim(),
        phone?.trim() || null,
        location?.trim() || null,
        github_url?.trim() || null,
        linkedin_url?.trim() || null,
        settingsId,
      ]
    );

    const [updatedRows] = await db.query(
      `SELECT
        id,
        site_name,
        site_title,
        site_description,
        email,
        phone,
        location,
        github_url,
        linkedin_url,
        resume_url,
        availability_status
      FROM site_settings
      WHERE id = ?
      LIMIT 1`,
      [settingsId]
    );

    res.json({
      success: true,
      message: "Site settings updated successfully",
      data: updatedRows[0],
    });
  } catch (error) {
    console.error("Update site settings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update site settings",
    });
  }
};