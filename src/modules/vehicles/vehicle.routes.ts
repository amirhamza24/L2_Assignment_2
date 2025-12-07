import { Router } from "express";
import { vehicleControllers } from "./vehicle.controller";
import auth from "../../middleware/auth";

const route = Router();

route.post("/", auth("admin"), vehicleControllers.createVehicle);

route.get("/", vehicleControllers.getAllVehicles);

route.get("/:vehicleId", vehicleControllers.getSingleVehicle);

route.put("/:vehicleId", auth("admin"), vehicleControllers.updateVehicle);

route.delete("/:vehicleId", auth("admin"), vehicleControllers.deleteVehicle);

export const vehicleRoutes = route;
