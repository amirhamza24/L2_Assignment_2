import express, { Request, Response } from "express";
import initDB from "./config/db";
const app = express();

//* parser
app.use(express.json());

//* initializing database
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Assignment 2 is running...");
});

//! users CRUD
// app.use("/api/v1/users");

export default app;
