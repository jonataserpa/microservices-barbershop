import { 
  scheduleRepository, 
  customerRepository,
  serviceRepository,
  barberRepository
} from "../../../infra/database";
import { CreateScheduleUseCase } from "./CreateScheduleUseCase";

// Inicialização dos casos de uso
const createScheduleUseCase = new CreateScheduleUseCase(
  scheduleRepository,
  customerRepository,
  serviceRepository
);

export {
  createScheduleUseCase
}; 