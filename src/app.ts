import express, { Request, Response } from "express";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/users/user.routes";
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

//! auth CRUD
app.use("/api/v1/auth", authRoutes);

//

export default app;
