import { IScheduleRepository } from '../../repositories/IScheduleRepository';
import { IServiceRepository } from '../../repositories/IServiceRepository';
import { ICustomerRepository } from '../../repositories/ICustomerRepository';
import { Schedule, CreateScheduleDTO, UpdateScheduleDTO, ScheduleStatus, ScheduleWithRelations } from '../../entities/Schedule';
import { IScheduleUseCase } from './IScheduleUseCase';

export class ScheduleUseCase implements IScheduleUseCase {
  constructor(
    private scheduleRepository: IScheduleRepository,
    private serviceRepository: IServiceRepository,
    private customerRepository: ICustomerRepository,
  ) {}

  async findAll(): Promise<ScheduleWithRelations[]> {
    return this.scheduleRepository.findAll();
  }

  async findById(id: string): Promise<ScheduleWithRelations> {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) {
      throw new Error('Agendamento não encontrado');
    }
    return schedule;
  }

  async findByCustomerId(customerId: string): Promise<ScheduleWithRelations[]> {
    return this.scheduleRepository.findByCustomerId(customerId);
  }

  async findByBarberId(barberId: string): Promise<ScheduleWithRelations[]> {
    return this.scheduleRepository.findByBarberId(barberId);
  }

  async findByDate(date: Date): Promise<ScheduleWithRelations[]> {
    return this.scheduleRepository.findByDate(date);
  }

  async create(data: CreateScheduleDTO): Promise<Schedule> {
    // Validar se o cliente existe e tem permissão
    const customer = await this.customerRepository.findById(data.customerId);
    if (!customer) {
      throw new Error('Cliente não encontrado');
    }

    // Validar idade mínima (3 anos)
    const birthDate = customer.birthDate;
    const age = new Date().getFullYear() - birthDate.getFullYear();
    if (age < 3) {
      throw new Error('Não é permitido agendar para crianças menores de 3 anos');
    }

    // Validar alergia
    if (customer.hasAllergy) {
      throw new Error('Não é permitido agendar para clientes com alergia de pele');
    }

    // Validar antecedência mínima (1 semana)
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    if (data.date.getTime() - new Date().getTime() < oneWeek) {
      throw new Error('O agendamento deve ser feito com no mínimo uma semana de antecedência');
    }

    // Validar conflito de horários
    const conflictingSchedules = await this.scheduleRepository.findConflictingSchedules(
      data.barberId,
      data.date,
    );
    if (conflictingSchedules.length > 0) {
      throw new Error('Já existe um agendamento confirmado para este horário');
    }

    // Validar serviços
    const services = await this.serviceRepository.findByIds(data.serviceIds);
    if (services.length !== data.serviceIds.length) {
      throw new Error('Um ou mais serviços não foram encontrados');
    }

    return this.scheduleRepository.create(data);
  }

  async update(id: string, data: UpdateScheduleDTO): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) {
      throw new Error('Agendamento não encontrado');
    }

    if (data.date) {
      // Validar antecedência mínima (1 semana)
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      if (data.date.getTime() - new Date().getTime() < oneWeek) {
        throw new Error('O agendamento deve ser feito com no mínimo uma semana de antecedência');
      }

      // Validar conflito de horários
      const conflictingSchedules = await this.scheduleRepository.findConflictingSchedules(
        schedule.barberId,
        data.date,
      );
      if (conflictingSchedules.length > 0) {
        throw new Error('Já existe um agendamento confirmado para este horário');
      }
    }

    if (data.serviceIds) {
      // Validar serviços
      const services = await this.serviceRepository.findByIds(data.serviceIds);
      if (services.length !== data.serviceIds.length) {
        throw new Error('Um ou mais serviços não foram encontrados');
      }
    }

    return this.scheduleRepository.update(id, data);
  }

  async cancel(id: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) {
      throw new Error('Agendamento não encontrado');
    }

    return this.scheduleRepository.update(id, { status: ScheduleStatus.CANCELLED });
  }

  async complete(id: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) {
      throw new Error('Agendamento não encontrado');
    }

    return this.scheduleRepository.update(id, { status: ScheduleStatus.COMPLETED });
  }

  async noShow(id: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) {
      throw new Error('Agendamento não encontrado');
    }

    return this.scheduleRepository.update(id, { status: ScheduleStatus.NO_SHOW });
  }
} 