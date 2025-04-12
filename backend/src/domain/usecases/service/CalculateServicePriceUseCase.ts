import { Service, ServiceType, ServicePrices } from "../../entities/Service";
import { IServiceRepository } from "../../repositories/IServiceRepository";

export class CalculateServicePriceUseCase {
  constructor(private serviceRepository: IServiceRepository) {}

  async execute(serviceIds: string[]): Promise<number> {
    if (!serviceIds.length) {
      return 0;
    }

    const services = await this.serviceRepository.findByIds(serviceIds);
    
    // Usa o método estático da classe Service para calcular o preço total
    return Service.calculateTotalPrice(services);
  }
} 