import { User, UserWithoutPassword } from './User';

/**
 * @swagger
 * components:
 *   schemas:
 *     Barber:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do barbeiro
 *         userId:
 *           type: string
 *           description: ID do usuário associado ao barbeiro
 *         specialty:
 *           type: string
 *           description: Especialidade do barbeiro (opcional)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 */
export class Barber {
  private _id: string;
  private _userId: string;
  private _specialty?: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _user?: User | UserWithoutPassword;

  constructor(
    id: string,
    userId: string,
    createdAt: Date,
    updatedAt: Date,
    specialty?: string,
    user?: User | UserWithoutPassword
  ) {
    this._id = id;
    this._userId = userId;
    this._specialty = specialty;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._user = user;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get specialty(): string | undefined {
    return this._specialty;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get user(): User | UserWithoutPassword | undefined {
    return this._user;
  }

  // Métodos de domínio (regras de negócio)

  /**
   * Verifica se o barbeiro tem uma especialidade definida
   * @returns true se tem especialidade, false caso contrário
   */
  hasSpecialty(): boolean {
    return !!this._specialty && this._specialty.trim().length > 0;
  }

  /**
   * Verifica se o barbeiro pode realizar atendimentos
   * @returns true se pode realizar atendimentos
   */
  canProvideService(): boolean {
    return true; // Por padrão, qualquer barbeiro cadastrado pode realizar atendimentos
  }

  /**
   * Verifica se o barbeiro é especialista no serviço específico
   * @param serviceType tipo do serviço
   * @returns true se é especialista naquele serviço
   */
  isSpecialistIn(serviceType: string): boolean {
    if (!this._specialty) return false;
    
    return this._specialty.toLowerCase().includes(serviceType.toLowerCase());
  }

  /**
   * Adiciona uma especialidade ao barbeiro
   * @param specialty Nova especialidade
   */
  addSpecialty(specialty: string): void {
    if (!this._specialty) {
      this._specialty = specialty;
    } else {
      this._specialty = `${this._specialty}, ${specialty}`;
    }
    this._updatedAt = new Date();
  }

  // Factory method para criar um objeto Barber a partir de dados brutos
  static create(
    data: BarberData,
    user?: User | UserWithoutPassword
  ): Barber {
    return new Barber(
      data.id,
      data.userId,
      data.createdAt,
      data.updatedAt,
      data.specialty,
      user
    );
  }

  // Converte o Barber para um objeto simples (para serialização/persistência)
  toJSON(): BarberData {
    return {
      id: this._id,
      userId: this._userId,
      specialty: this._specialty,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      user: this._user
    };
  }
}

export interface BarberData {
  id: string;
  userId: string;
  specialty?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User | UserWithoutPassword;
}

export interface BarberWithUser {
  id: string;
  userId: string;
  specialty?: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserWithoutPassword;
}

export interface CreateBarberDTO {
  userId: string;
  specialty?: string;
}

export interface UpdateBarberDTO {
  specialty?: string;
} 