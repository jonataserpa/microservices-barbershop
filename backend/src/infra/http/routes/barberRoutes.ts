import { Router } from "express";
import { barberController } from "../controllers";

const barberRoutes = Router();

// Rotas de barbeiros
barberRoutes.get("/", barberController.findAll.bind(barberController));
barberRoutes.get("/user/:userId", barberController.findByUserId.bind(barberController));
barberRoutes.get("/:id", barberController.findById.bind(barberController));
barberRoutes.post("/", barberController.create.bind(barberController));
barberRoutes.put("/:id", barberController.update.bind(barberController));
barberRoutes.delete("/:id", barberController.delete.bind(barberController));

export { barberRoutes }; 