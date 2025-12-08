import { pool } from "../../config/db";

interface VehiclePayload {
  vehicle_name?: string;
  type?: string;
  registration_number?: string;
  daily_rent_price?: number;
  availability_status?: string;
}

const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const vehicleType = type || "car";
  const vehicleAvailabilityStatus = availability_status || "available";

  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [
      vehicle_name,
      (vehicleType as string).toLowerCase(),
      registration_number,
      daily_rent_price,
      vehicleAvailabilityStatus,
    ]
  );
  return result;
};

const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);

  return result;
};

const getSingleVehicle = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);

  return result;
};

const updateVehicle = async (vehicleId: string, payload: VehiclePayload) => {
  const keys = Object.keys(payload) as (keyof VehiclePayload)[];

  if (keys.length === 0) {
    throw new Error("No fields provided for update");
  }

  const setQuery = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const values = keys.map((key) => {
    if (key === "type" && payload[key]) {
      return payload[key]!.toLowerCase();
    }
    return payload[key];
  });

  values.push(vehicleId);

  const result = await pool.query(
    `UPDATE vehicles SET ${setQuery} WHERE id = $${
      keys.length + 1
    } RETURNING *`,
    values
  );

  return result;
};

const deleteVehicle = async (id: string) => {
  const activeBookingCheck = await pool.query(
    `SELECT * FROM bookings 
     WHERE vehicle_id = $1 AND status = 'active'`,
    [id]
  );

  if (activeBookingCheck.rows.length > 0) {
    throw new Error(
      "Vehicle cannot be deleted because it has active bookings!"
    );
  }

  const result = await pool.query(
    `DELETE FROM vehicles WHERE id = $1 RETURNING *`,
    [id]
  );

  return result;
};

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
