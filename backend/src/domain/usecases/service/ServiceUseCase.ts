import { IServiceRepository } from '../../repositories/IServiceRepository';
import { Service, CreateServiceDTO, UpdateServiceDTO } from '../../entities/Service';
import { IServiceUseCase } from './IServiceUseCase';

export class ServiceUseCase implements IServiceUseCase {
  constructor(private serviceRepository: IServiceRepository) {}

  async findAll(): Promise<Service[]> {
    return this.serviceRepository.findAll();
  }

  async findById(id: string): Promise<Service> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new Error('Serviço não encontrado');
    }
    return service;
  }

  async create(data: CreateServiceDTO): Promise<Service> {
    // Validar preço e duração
    if (data.price <= 0) {
      throw new Error('O preço deve ser maior que zero');
    }
    if (data.duration <= 0) {
      throw new Error('A duração deve ser maior que zero');
    }

    return this.serviceRepository.create(data);
  }

  async update(id: string, data: UpdateServiceDTO): Promise<Service> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new Error('Serviço não encontrado');
    }

    // Validar preço e duração se fornecidos
    if (data.price !== undefined && data.price <= 0) {
      throw new Error('O preço deve ser maior que zero');
    }
    if (data.duration !== undefined && data.duration <= 0) {
      throw new Error('A duração deve ser maior que zero');
    }

    return this.serviceRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new Error('Serviço não encontrado');
    }

    await this.serviceRepository.delete(id);
  }
} 