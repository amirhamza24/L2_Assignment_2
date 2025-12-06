import express, { Request, Response } from "express";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/users/user.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicle.routes";
const app = express();

//* parser
app.use(express.json());

//* initializing database
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Assignment 2 is running...");
});

//! users CRUD
app.use("/api/v1/users", userRoutes);

//* Vehicles
app.use("/api/v1/vehicles", vehicleRoutes);

//! auth CRUD
app.use("/api/v1/auth", authRoutes);

//

export default app;
