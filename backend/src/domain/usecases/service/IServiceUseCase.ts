import { Service, CreateServiceDTO, UpdateServiceDTO } from '../../entities/Service';

export interface IServiceUseCase {
  findAll(): Promise<Service[]>;
  findById(id: string): Promise<Service>;
  create(data: CreateServiceDTO): Promise<Service>;
  update(id: string, data: UpdateServiceDTO): Promise<Service>;
  delete(id: string): Promise<void>;
} 