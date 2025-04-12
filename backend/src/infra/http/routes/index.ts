import { Router } from "express";
import { scheduleRoutes } from "./scheduleRoutes";
import { customerRoutes } from "./customerRoutes";
import { serviceRoutes } from "./serviceRoutes";
import { userRoutes } from "./userRoutes";

const routes = Router();

// Rotas para agendamentos
routes.use("/scheduling", scheduleRoutes);

// Rotas para clientes
routes.use("/customers", customerRoutes);

// Rotas para serviços
routes.use("/services", serviceRoutes);

// Rotas para usuários
routes.use("/users", userRoutes);

export { routes }; 