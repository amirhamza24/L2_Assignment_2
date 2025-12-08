import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(`SELECT id, name, email, phone, role
    FROM users`);

  return result;
};

const getSingleUser = async (id: string) => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users WHERE id = $1`,
    [id]
  );

  return result;
};

const updateUser = async (
  name: string,
  email: string,
  role: string,
  phone: string,
  userId: string
) => {
  if (role) {
    const result = await pool.query(
      `UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING *`,
      [name, email, phone, role, userId]
    );

    return result;
  } else {
    const result = await pool.query(
      `UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *`,
      [name, email, phone, userId]
    );

    return result;
  }

  // const result = await pool.query(
  //   `UPDATE users SET name = $1, email = $2, role = $3, phone = $4 WHERE id = $5 RETURNING *`,
  //   [name, email, role, phone, userId]
  // );

  // return result;
};

const deleteUser = async (id: string) => {
  const activeBookingCheck = await pool.query(
    `SELECT * FROM bookings 
     WHERE customer_id = $1 AND status = 'active'`,
    [id]
  );

  if (activeBookingCheck.rows.length > 0) {
    return {
      success: false,
      message: "User cannot be deleted because it has active bookings!",
      data: null,
    };
  }

  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING *`,
    [id]
  );

  return {
    success: true,
    message: "User deleted successfully",
    data: result,
  };
};

export const userServices = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
