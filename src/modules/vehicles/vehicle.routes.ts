import { Router } from "express";
import { vehicleControllers } from "./vehicle.controller";

const route = Router();

route.post("/", vehicleControllers.createVehicle);

route.get("/", vehicleControllers.getAllVehicles);

route.get("/:id", vehicleControllers.getSingleVehicle);

route.put("/:id", vehicleControllers.updateVehicle);

route.delete("/:id", vehicleControllers.deleteVehicle);

export const vehicleRoutes = route;
