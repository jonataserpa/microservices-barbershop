import { serviceRepository } from "../../../infra/database";
import { CalculateServicePriceUseCase } from "./CalculateServicePriceUseCase";

// Inicialização dos casos de uso
const calculateServicePriceUseCase = new CalculateServicePriceUseCase(serviceRepository);

export {
  calculateServicePriceUseCase
}; 