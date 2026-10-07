import db from "../config/db.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [[projectsResult]] = await db.query(
      `SELECT COUNT(*) AS count
       FROM projects
       WHERE is_active = TRUE`
    );

    const [[skillsResult]] = await db.query(
      `SELECT COUNT(*) AS count
       FROM skills
       WHERE is_active = TRUE`
    );

    const [[experienceResult]] = await db.query(
      `SELECT COUNT(*) AS count
       FROM experience
       WHERE is_active = TRUE`
    );

    const [[educationResult]] = await db.query(
      `SELECT COUNT(*) AS count
       FROM education
       WHERE is_active = TRUE`
    );

    const [[messagesResult]] = await db.query(
      `SELECT COUNT(*) AS count
       FROM contact_messages`
    );

    const [[unreadMessagesResult]] = await db.query(
      `SELECT COUNT(*) AS count
       FROM contact_messages
       WHERE is_read = FALSE`
    );

    res.json({
      success: true,
      data: {
        projects: Number(projectsResult.count),
        skills: Number(skillsResult.count),
        experience: Number(experienceResult.count),
        education: Number(educationResult.count),
        messages: Number(messagesResult.count),
        unreadMessages: Number(unreadMessagesResult.count),
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};
