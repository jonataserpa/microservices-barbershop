import { Barber, CreateBarberDTO, UpdateBarberDTO, BarberWithUser } from '../entities/Barber';

export interface IBarberRepository {
  findAll(): Promise<BarberWithUser[]>;
  findById(id: string): Promise<BarberWithUser | null>;
  findByUserId(userId: string): Promise<BarberWithUser | null>;
  create(data: CreateBarberDTO): Promise<Barber>;
  update(id: string, data: UpdateBarberDTO): Promise<Barber>;
  delete(id: string): Promise<void>;
} 