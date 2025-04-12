import { ScheduleController } from "./ScheduleController";
import { UserController } from "./UserController";
import { CustomerController } from "./CustomerController";
import { ServiceController } from "./ServiceController";
import { BarberController } from "./BarberController";

// Exporta as instâncias dos controllers
const scheduleController = new ScheduleController();
const userController = new UserController();
const customerController = new CustomerController();
const serviceController = new ServiceController();
const barberController = new BarberController();

export {
  scheduleController,
  userController,
  customerController,
  serviceController,
  barberController
}; 