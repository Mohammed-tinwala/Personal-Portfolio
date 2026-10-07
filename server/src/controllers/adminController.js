import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    console.log("EMAIL SENT:", JSON.stringify(email.trim())); // 👈 LOG 1

    const [rows] = await db.query(
      `SELECT
        id,
        name,
        email,
        password_hash,
        role,
        is_active
      FROM admin_users
      WHERE email = ?
      LIMIT 1`,
      [email.trim()]
    );

    console.log("ROWS FOUND:", rows.length); // 👈 LOG 2

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const admin = rows[0];

     console.log("HASH:", admin.password_hash, "LENGTH:", admin.password_hash?.length); // 👈 LOG 3

    if (!admin.is_active) {
      return res.status(403).json({
        success: false,
        message: "Admin account is inactive",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password_hash
    );

    console.log("MATCH:", passwordMatch); // 👈 LOG 4

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      // eslint-disable-next-line no-undef
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Admin login successful",
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      success: false,
      message: "Admin login failed",
    });
  }
};

export const getCurrentAdmin = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        name,
        email,
        role,
        is_active
      FROM admin_users
      WHERE id = ?
      LIMIT 1`,
      [req.admin.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found",
      });
    }

    const admin = rows[0];

    if (!admin.is_active) {
      return res.status(403).json({
        success: false,
        message: "Admin account is inactive",
      });
    }

    res.json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error("Get current admin error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch admin profile",
    });
  }
};

export const logoutAdmin = (req, res) => {
  res.clearCookie("admin_token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.json({
    success: true,
    message: "Admin logout successful",
  });
};