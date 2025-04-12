import { Prisma } from "@prisma/client";
import { 
  Schedule, 
  ScheduleWithRelations, 
  CreateScheduleDTO, 
  UpdateScheduleDTO,
  ScheduleStatus
} from "../../../../domain/entities/Schedule";
import { IScheduleRepository } from "../../../../domain/repositories/IScheduleRepository";
import { prisma } from "../prismaClient";

export class ScheduleRepository implements IScheduleRepository {
  async findAll(): Promise<ScheduleWithRelations[]> {
    const schedules = await prisma.schedule.findMany({
      include: {
        customer: {
          include: {
            user: true
          }
        },
        barber: {
          include: {
            user: true
          }
        },
        services: {
          include: {
            service: true
          }
        }
      }
    });

    return schedules as unknown as ScheduleWithRelations[];
  }

  async findById(id: string): Promise<ScheduleWithRelations | null> {
    const schedule = await prisma.schedule.findUnique({
      where: { id },
      include: {
        customer: {
          include: {
            user: true
          }
        },
        barber: {
          include: {
            user: true
          }
        },
        services: {
          include: {
            service: true
          }
        }
      }
    });

    return schedule as unknown as ScheduleWithRelations | null;
  }

  async findByCustomerId(customerId: string): Promise<ScheduleWithRelations[]> {
    const schedules = await prisma.schedule.findMany({
      where: { customerId },
      include: {
        customer: {
          include: {
            user: true
          }
        },
        barber: {
          include: {
            user: true
          }
        },
        services: {
          include: {
            service: true
          }
        }
      }
    });

    return schedules as unknown as ScheduleWithRelations[];
  }

  async findByBarberId(barberId: string): Promise<ScheduleWithRelations[]> {
    const schedules = await prisma.schedule.findMany({
      where: { barberId },
      include: {
        customer: {
          include: {
            user: true
          }
        },
        barber: {
          include: {
            user: true
          }
        },
        services: {
          include: {
            service: true
          }
        }
      }
    });

    return schedules as unknown as ScheduleWithRelations[];
  }

  async findByDate(date: Date): Promise<ScheduleWithRelations[]> {
    // Cria um intervalo para o dia inteiro
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const schedules = await prisma.schedule.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        customer: {
          include: {
            user: true
          }
        },
        barber: {
          include: {
            user: true
          }
        },
        services: {
          include: {
            service: true
          }
        }
      }
    });

    return schedules as unknown as ScheduleWithRelations[];
  }

  async findConflictingSchedules(barberId: string, date: Date): Promise<Schedule[]> {
    // Obtém a hora do agendamento
    const scheduleHour = new Date(date);
    
    // Para simplificar, vamos considerar que cada agendamento dura 1 hora
    // Em uma implementação real, isso dependeria dos serviços selecionados
    const startTime = new Date(scheduleHour);
    const endTime = new Date(scheduleHour);
    endTime.setHours(endTime.getHours() + 1);

    const conflictingSchedules = await prisma.schedule.findMany({
      where: {
        barberId,
        status: 'CONFIRMED',
        date: {
          gte: startTime,
          lt: endTime
        }
      }
    });

    return conflictingSchedules as unknown as Schedule[];
  }

  async create(data: CreateScheduleDTO): Promise<Schedule> {
    const { customerId, barberId, date, serviceIds } = data;

    // Primeiro encontrar os serviços para obter os preços
    const services = await prisma.service.findMany({
      where: {
        id: {
          in: serviceIds
        }
      }
    });

    // Transação para garantir que tudo é criado corretamente
    const schedule = await prisma.$transaction(async (tx) => {
      // Criar o agendamento
      const newSchedule = await tx.schedule.create({
        data: {
          customerId,
          barberId,
          date,
          status: 'PENDING',
        }
      });

      // Criar as relações de serviços
      for (const service of services) {
        await tx.scheduleService.create({
          data: {
            scheduleId: newSchedule.id,
            serviceId: service.id,
            price: service.price
          }
        });
      }

      return newSchedule;
    });

    return schedule as unknown as Schedule;
  }

  async update(id: string, data: UpdateScheduleDTO): Promise<Schedule> {
    const { status, date, serviceIds } = data;
    const updateData: Prisma.ScheduleUpdateInput = {};

    if (status) updateData.status = status;
    if (date) updateData.date = date;

    const schedule = await prisma.$transaction(async (tx) => {
      // Atualizar o agendamento
      const updatedSchedule = await tx.schedule.update({
        where: { id },
        data: updateData
      });

      // Se houver novos serviços, atualizar
      if (serviceIds && serviceIds.length > 0) {
        // Remover serviços atuais
        await tx.scheduleService.deleteMany({
          where: {
            scheduleId: id
          }
        });

        // Buscar os novos serviços
        const services = await tx.service.findMany({
          where: {
            id: {
              in: serviceIds
            }
          }
        });

        // Adicionar os novos serviços
        for (const service of services) {
          await tx.scheduleService.create({
            data: {
              scheduleId: id,
              serviceId: service.id,
              price: service.price
            }
          });
        }
      }

      return updatedSchedule;
    });

    return schedule as unknown as Schedule;
  }

  async delete(id: string): Promise<void> {
    await prisma.$transaction([
      // Primeiro remove os serviços relacionados
      prisma.scheduleService.deleteMany({
        where: {
          scheduleId: id
        }
      }),
      // Depois remove o agendamento
      prisma.schedule.delete({
        where: { id }
      })
    ]);
  }
} 