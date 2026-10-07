import db from "../config/db.js";

export const createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO contact_messages
        (name, email, subject, message)
       VALUES (?, ?, ?, ?)`,
      [
        name.trim(),
        email.trim(),
        subject?.trim() || null,
        message.trim(),
      ]
    );

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully",
      data: {
        id: result.insertId,
      },
    });
  } catch (error) {
    console.error("Create contact message error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send your message",
    });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        name,
        email,
        subject,
        message,
        is_read,
        created_at
      FROM contact_messages
      ORDER BY created_at DESC, id DESC`
    );

    res.json({
      success: true,
      data: rows.map((item) => ({
        ...item,
        is_read: Boolean(item.is_read),
      })),
    });
  } catch (error) {
    console.error("Get contact messages error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch contact messages",
    });
  }
};

export const markContactMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingRows] = await db.query(
      `SELECT id
       FROM contact_messages
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    await db.query(
      `UPDATE contact_messages
       SET is_read = TRUE
       WHERE id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: "Message marked as read",
    });
  } catch (error) {
    console.error("Mark contact message as read error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to mark message as read",
    });
  }
};

export const markContactMessageAsUnread = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingRows] = await db.query(
      `SELECT id
       FROM contact_messages
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    await db.query(
      `UPDATE contact_messages
       SET is_read = FALSE
       WHERE id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: "Message marked as unread",
    });
  } catch (error) {
    console.error("Mark contact message as unread error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to mark message as unread",
    });
  }
};

export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingRows] = await db.query(
      `SELECT id
       FROM contact_messages
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    await db.query(
      `DELETE FROM contact_messages
       WHERE id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: "Contact message deleted successfully",
    });
  } catch (error) {
    console.error("Delete contact message error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete contact message",
    });
  }
};
