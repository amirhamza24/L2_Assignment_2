import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicleIdResult = await pool.query(
    `SELECT * FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );

  if (vehicleIdResult.rows.length === 0) {
    return {
      success: false,
      message: "Vehicle not found!",
    };
  }

  const vehicle = vehicleIdResult.rows[0];

  if (vehicle.availability_status === "booked") {
    return {
      success: false,
      message: "Vehicle is not available!",
    };
  }

  const start = new Date(rent_start_date as string);
  const end = new Date(rent_end_date as string);

  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (isNaN(days) || days <= 0) {
    return { success: false, message: "Invalid rental time!" };
  }

  const total_price = days * Number(vehicle.daily_rent_price);

  const bookingResult = await pool.query(
    `
    INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, 'active') RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  const booking = bookingResult.rows[0];

  await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicle_id]
  );

  return {
    success: true,
    data: {
      ...booking,
      vehicle: {
        vehicle_name: vehicle.vehicle_name,
        daily_rent_price: Number(vehicle.daily_rent_price),
      },
    },
  };
};

const getAllBookings = async () => {
  const result = await pool.query(`
    SELECT 
      b.*, 
      u.name AS customer_name,
      u.email AS customer_email,
      v.vehicle_name,
      v.registration_number
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
    ORDER BY b.id DESC
  `);

  // Map rows into nested objects
  const bookings = result.rows.map((row) => ({
    id: row.id,
    customer_id: row.customer_id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: row.total_price,
    status: row.status,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
    },
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
    },
  }));

  return bookings;
};

const getAllBookingsByCustomer = async (customerId: string) => {
  const result = await pool.query(
    `
    SELECT 
      b.*, 
      v.vehicle_name,
      v.registration_number,
      v.type
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.id DESC
  `,
    [customerId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    customer_id: row.customer_id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: row.total_price,
    status: row.status,
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
      type: row.type,
    },
  }));
};

const updateBooking = async (bookingId: string, role: string) => {
  const bookingResult = await pool.query(
    `SELECT * FROM bookings where id = $1`,
    [bookingId]
  );

  if (bookingResult.rows.length === 0) {
    return {
      success: false,
      message: "Booking not found!",
    };
  }

  const booking = bookingResult.rows[0];
  const vehicleId = booking.vehicle_id;

  const nowDate = new Date();
  const rentStartDate = new Date(booking.rent_start_date);
  const rentEndDate = new Date(booking.rent_end_date);

  if (role === "customer") {
    if (nowDate >= rentStartDate) {
      return {
        success: false,
        message: "You cannot cancel after rental start date!",
      };
    }

    const updated = await pool.query(
      `UPDATE bookings SET status = 'cancelled' WHERE id = $1 RETURNING *`,
      [bookingId]
    );

    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [vehicleId]
    );

    return {
      success: true,
      message: "Booking cancelled successfully",
      data: updated.rows[0],
    };
  }

  if (role === "admin") {
    const updated = await pool.query(
      `UPDATE bookings SET status='returned' WHERE id=$1 RETURNING *`,
      [bookingId]
    );

    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [vehicleId]
    );

    return {
      success: true,
      message: "Booking marked as returned. Vehicle is now available",
      data: updated.rows[0],
    };
  }

  return { success: false, message: "Unauthorized action!" };
};

export const bookingServices = {
  createBooking,
  getAllBookings,
  getAllBookingsByCustomer,
  updateBooking,
};
