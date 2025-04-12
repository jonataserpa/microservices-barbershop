import { Schedule, CreateScheduleDTO, UpdateScheduleDTO, ScheduleWithRelations } from '../entities/Schedule';

export interface IScheduleRepository {
  findAll(): Promise<ScheduleWithRelations[]>;
  findById(id: string): Promise<ScheduleWithRelations | null>;
  findByCustomerId(customerId: string): Promise<ScheduleWithRelations[]>;
  findByBarberId(barberId: string): Promise<ScheduleWithRelations[]>;
  findByDate(date: Date): Promise<ScheduleWithRelations[]>;
  findConflictingSchedules(barberId: string, date: Date): Promise<Schedule[]>;
  create(data: CreateScheduleDTO): Promise<Schedule>;
  update(id: string, data: UpdateScheduleDTO): Promise<Schedule>;
  delete(id: string): Promise<void>;
} 