import { CreateScheduleDTO, Schedule, ScheduleData, ScheduleStatus } from "../../entities/Schedule";
import { IScheduleRepository } from "../../repositories/IScheduleRepository";
import { ICustomerRepository } from "../../repositories/ICustomerRepository";
import { IServiceRepository } from "../../repositories/IServiceRepository";

export class CreateScheduleUseCase {
  constructor(
    public readonly scheduleRepository: IScheduleRepository,
    public readonly customerRepository: ICustomerRepository,
    private serviceRepository: IServiceRepository
  ) {}

  async execute(data: CreateScheduleDTO): Promise<Schedule> {
    const { customerId, barberId, date, serviceIds } = data;

    // Cria um objeto Schedule temporário para validação
    const tempSchedule = Schedule.create({
      id: 'temp-id', // Será substituído pelo repositório
      customerId,
      barberId,
      date,
      status: ScheduleStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Valida a data do agendamento
    const dateError = tempSchedule.validateDate();
    if (dateError) {
      throw new Error(dateError);
    }

    // Verifica se já existe um agendamento conflitante para o mesmo barbeiro e horário
    const conflictingSchedules = await this.scheduleRepository.findConflictingSchedules(barberId, date);
    if (conflictingSchedules.length > 0) {
      throw new Error("Já existe um agendamento confirmado para o horário solicitado");
    }

    // Verifica se o cliente existe
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new Error("Cliente não encontrado");
    }

    // Verifica as regras de negócio do cliente
    if (!customer.canBeServed()) {
      const allergyError = customer.validateAllergy();
      if (allergyError) {
        throw new Error(allergyError);
      }
      
      const ageError = customer.validateAge();
      if (ageError) {
        throw new Error(ageError);
      }
      
      // Se chegou aqui, deve haver outro motivo para não poder ser atendido
      throw new Error("Cliente não pode ser atendido devido a restrições");
    }

    // Busca os serviços solicitados
    const services = await this.serviceRepository.findByIds(serviceIds);
    if (services.length !== serviceIds.length) {
      throw new Error("Um ou mais serviços solicitados não foram encontrados");
    }

    // Cria o agendamento
    return this.scheduleRepository.create(data);
  }
} 