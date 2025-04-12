import { Barber } from './Barber';
import { Customer } from './Customer';
import { Service } from './Service';
import { isHoliday } from '../../utils/dateUtils';

/**
 * @swagger
 * components:
 *   schemas:
 *     ScheduleStatus:
 *       type: string
 *       enum:
 *         - PENDING
 *         - CONFIRMED
 *         - CANCELED
 *         - COMPLETED
 *       description: Status possíveis para um agendamento
 */
export enum ScheduleStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED'
}

export class Schedule {
  private _id: string;
  private _customerId: string;
  private _barberId: string;
  private _date: Date;
  private _status: ScheduleStatus;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _customer?: Customer;
  private _barber?: Barber;
  private _services?: ScheduleService[];

  constructor(
    id: string,
    customerId: string,
    barberId: string,
    date: Date,
    status: ScheduleStatus,
    createdAt: Date,
    updatedAt: Date,
    customer?: Customer,
    barber?: Barber,
    services?: ScheduleService[]
  ) {
    this._id = id;
    this._customerId = customerId;
    this._barberId = barberId;
    this._date = date;
    this._status = status;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._customer = customer;
    this._barber = barber;
    this._services = services;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get customerId(): string {
    return this._customerId;
  }

  get barberId(): string {
    return this._barberId;
  }

  get date(): Date {
    return this._date;
  }

  get status(): ScheduleStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get customer(): Customer | undefined {
    return this._customer;
  }

  get barber(): Barber | undefined {
    return this._barber;
  }

  get services(): ScheduleService[] | undefined {
    return this._services;
  }

  // Métodos de domínio (regras de negócio)
  
  /**
   * Verifica se a data do agendamento é válida conforme as regras de negócio
   * @returns mensagem de erro se a data for inválida, undefined caso contrário
   */
  validateDate(): string | undefined {
    // Verifica se a data é um feriado
    if (isHoliday(this._date)) {
      return "Não é possível agendar em feriados";
    }

    // Verifica se a data está com pelo menos uma semana de antecedência
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    
    if (this._date < oneWeekFromNow) {
      return "O agendamento deve ser feito com pelo menos uma semana de antecedência";
    }

    return undefined;
  }

  /**
   * Atualiza o status do agendamento
   * @param status Novo status a ser definido
   */
  updateStatus(status: ScheduleStatus): void {
    this._status = status;
    this._updatedAt = new Date();
  }

  /**
   * Verifica se o agendamento pode ser cancelado
   * @returns true se o agendamento pode ser cancelado, false caso contrário
   */
  canBeCanceled(): boolean {
    // Agendamentos só podem ser cancelados se estiverem pendentes ou confirmados
    return this._status === ScheduleStatus.PENDING || this._status === ScheduleStatus.CONFIRMED;
  }

  /**
   * Tenta cancelar o agendamento
   * @returns true se o agendamento foi cancelado com sucesso, false caso contrário
   */
  cancel(): boolean {
    if (this.canBeCanceled()) {
      this.updateStatus(ScheduleStatus.CANCELED);
      return true;
    }
    return false;
  }

  /**
   * Verifica se o agendamento pode ser completado
   * @returns true se o agendamento pode ser completado, false caso contrário
   */
  canBeCompleted(): boolean {
    // Apenas agendamentos confirmados podem ser completados
    return this._status === ScheduleStatus.CONFIRMED;
  }

  /**
   * Tenta completar o agendamento
   * @returns true se o agendamento foi completado com sucesso, false caso contrário
   */
  complete(): boolean {
    if (this.canBeCompleted()) {
      this.updateStatus(ScheduleStatus.COMPLETED);
      return true;
    }
    return false;
  }

  // Factory method para criar um objeto Schedule a partir de dados brutos
  static create(
    data: ScheduleData,
    customer?: Customer,
    barber?: Barber,
    services?: ScheduleService[]
  ): Schedule {
    return new Schedule(
      data.id,
      data.customerId,
      data.barberId,
      data.date,
      data.status,
      data.createdAt,
      data.updatedAt,
      customer,
      barber,
      services
    );
  }

  // Converte o Schedule para um objeto simples (para serialização/persistência)
  toJSON(): ScheduleData {
    return {
      id: this._id,
      customerId: this._customerId,
      barberId: this._barberId,
      date: this._date,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}

export interface ScheduleData {
  id: string;
  customerId: string;
  barberId: string;
  date: Date;
  status: ScheduleStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleService {
  scheduleId: string;
  serviceId: string;
  price: number;
  service?: Service;
}

export interface CreateScheduleDTO {
  customerId: string;
  barberId: string;
  date: Date;
  serviceIds: string[];
}

export interface UpdateScheduleDTO {
  status?: ScheduleStatus;
  date?: Date;
  serviceIds?: string[];
}

export interface ScheduleWithRelations {
  id: string;
  customerId: string;
  barberId: string;
  date: Date;
  status: ScheduleStatus;
  createdAt: Date;
  updatedAt: Date;
  customer: Customer;
  barber: Barber;
  services: (ScheduleService & { service: Service })[];
} 