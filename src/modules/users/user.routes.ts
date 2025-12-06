import { Router } from "express";
import { userControllers } from "./user.controller";

const router = Router();

router.get("/", userControllers.getAllUsers);

router.get("/:id", userControllers.getSingleUser);

export const userRoutes = router;
