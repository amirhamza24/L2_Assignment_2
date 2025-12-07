import cron from "node-cron";
import { pool } from "../config/db";

// Run once every day at midnight (00:00)
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Running daily auto-return job...");

    // Update bookings whose rent_end_date is past
    const result = await pool.query(`
      UPDATE bookings
      SET status = 'returned'
      WHERE status = 'active'
      AND rent_end_date < NOW()
      RETURNING *
    `);

    if (result.rows.length > 0) {
      console.log(`Auto returned ${result.rows.length} bookings`);

      // Update vehicles availability for returned bookings
      const vehicleIds = result.rows.map((row) => row.vehicle_id);

      await pool.query(
        `UPDATE vehicles SET availability_status='available' WHERE id = ANY($1::int[])`,
        [vehicleIds]
      );
    } else {
      console.log("No bookings to auto-return today.");
    }
  } catch (error) {
    console.error("Auto return error:", error);
  }
});
