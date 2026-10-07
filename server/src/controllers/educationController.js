import db from "../config/db.js";

export const getEducation = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        institution_name,
        degree,
        field_of_study,
        location,
        start_year,
        end_year,
        grade,
        description,
        institution_url,
        sort_order
      FROM education
      WHERE is_active = TRUE
      ORDER BY sort_order ASC, end_year DESC, id DESC`
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Get education error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch education",
    });
  }
};

export const getAllEducation = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        institution_name,
        degree,
        field_of_study,
        location,
        start_year,
        end_year,
        grade,
        description,
        institution_url,
        sort_order,
        is_active
      FROM education
      ORDER BY sort_order ASC, end_year DESC, id DESC`
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Get all education error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch all education",
    });
  }
};

export const createEducation = async (req, res) => {
  try {
    const {
      institution_name,
      degree,
      field_of_study,
      location,
      start_year,
      end_year,
      grade,
      description,
      institution_url,
      sort_order,
    } = req.body;

    if (
      !institution_name ||
      !degree ||
      !start_year ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Institution name, degree, start year and description are required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO education
        (
          institution_name,
          degree,
          field_of_study,
          location,
          start_year,
          end_year,
          grade,
          description,
          institution_url,
          sort_order,
          is_active
        )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [
        institution_name.trim(),
        degree.trim(),
        field_of_study?.trim() || null,
        location?.trim() || null,
        Number(start_year),
        end_year ? Number(end_year) : null,
        grade?.trim() || null,
        description.trim(),
        institution_url?.trim() || null,
        Number(sort_order) || 0,
      ]
    );

    const [rows] = await db.query(
      `SELECT
        id,
        institution_name,
        degree,
        field_of_study,
        location,
        start_year,
        end_year,
        grade,
        description,
        institution_url,
        sort_order,
        is_active
      FROM education
      WHERE id = ?
      LIMIT 1`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Education created successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("Create education error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create education",
    });
  }
};

export const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      institution_name,
      degree,
      field_of_study,
      location,
      start_year,
      end_year,
      grade,
      description,
      institution_url,
      sort_order,
      is_active,
    } = req.body;

    if (
      !institution_name ||
      !degree ||
      !start_year ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Institution name, degree, start year and description are required",
      });
    }

    const [existingRows] = await db.query(
      `SELECT id
       FROM education
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Education record not found",
      });
    }

    await db.query(
      `UPDATE education
       SET
        institution_name = ?,
        degree = ?,
        field_of_study = ?,
        location = ?,
        start_year = ?,
        end_year = ?,
        grade = ?,
        description = ?,
        institution_url = ?,
        sort_order = ?,
        is_active = ?
       WHERE id = ?`,
      [
        institution_name.trim(),
        degree.trim(),
        field_of_study?.trim() || null,
        location?.trim() || null,
        Number(start_year),
        end_year ? Number(end_year) : null,
        grade?.trim() || null,
        description.trim(),
        institution_url?.trim() || null,
        Number(sort_order) || 0,
        is_active ? 1 : 0,
        id,
      ]
    );

    const [updatedRows] = await db.query(
      `SELECT
        id,
        institution_name,
        degree,
        field_of_study,
        location,
        start_year,
        end_year,
        grade,
        description,
        institution_url,
        sort_order,
        is_active
      FROM education
      WHERE id = ?
      LIMIT 1`,
      [id]
    );

    res.json({
      success: true,
      message: "Education updated successfully",
      data: updatedRows[0],
    });
  } catch (error) {
    console.error("Update education error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update education",
    });
  }
};

export const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingRows] = await db.query(
      `SELECT id
       FROM education
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Education record not found",
      });
    }

    await db.query(
      `DELETE FROM education
       WHERE id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    console.error("Delete education error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete education",
    });
  }
};
