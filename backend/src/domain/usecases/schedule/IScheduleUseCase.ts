import { Schedule, CreateScheduleDTO, UpdateScheduleDTO, ScheduleWithRelations } from '../../entities/Schedule';

export interface IScheduleUseCase {
  findAll(): Promise<ScheduleWithRelations[]>;
  findById(id: string): Promise<ScheduleWithRelations>;
  findByCustomerId(customerId: string): Promise<ScheduleWithRelations[]>;
  findByBarberId(barberId: string): Promise<ScheduleWithRelations[]>;
  findByDate(date: Date): Promise<ScheduleWithRelations[]>;
  create(data: CreateScheduleDTO): Promise<Schedule>;
  update(id: string, data: UpdateScheduleDTO): Promise<Schedule>;
  cancel(id: string): Promise<Schedule>;
  complete(id: string): Promise<Schedule>;
  noShow(id: string): Promise<Schedule>;
} 