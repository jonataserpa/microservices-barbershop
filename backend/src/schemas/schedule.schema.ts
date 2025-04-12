import { z } from 'zod';
import { ScheduleStatus } from '../domain/entities/Schedule';

export const createScheduleSchema = z.object({
  body: z.object({
    customerId: z.string().uuid('ID do cliente inválido'),
    barberId: z.string().uuid('ID do barbeiro inválido'),
    date: z.string().transform((str) => new Date(str)),
    serviceIds: z.array(z.string().uuid('ID de serviço inválido')).min(1, 'Selecione pelo menos um serviço'),
  }),
});

export const updateScheduleSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
  body: z.object({
    date: z.string().transform((str) => new Date(str)).optional(),
    status: z.enum([
      ScheduleStatus.PENDING,
      ScheduleStatus.CONFIRMED,
      ScheduleStatus.CANCELLED,
      ScheduleStatus.COMPLETED,
      ScheduleStatus.NO_SHOW,
    ]).optional(),
    serviceIds: z.array(z.string().uuid('ID de serviço inválido')).min(1, 'Selecione pelo menos um serviço').optional(),
  }),
}); 