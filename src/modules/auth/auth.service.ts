import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";

const signUp = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const userRole = role || "customer";

  // Password validation
  if (typeof password !== "string" || password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const hashedPassword = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPassword, phone, userRole]
  );

  return result;
};

const signIn = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];

  const matchedPassword = await bcrypt.compare(password, user.password);

  if (!matchedPassword) {
    return false;
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
    config.jwtSecret as string,
    { expiresIn: "7d" }
  );

  const bearerToken = `Bearer ${token}`;

  return { token: bearerToken, user };
};

export const authServices = {
  signUp,
  signIn,
};
