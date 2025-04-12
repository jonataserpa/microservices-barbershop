import { User, UserWithoutPassword } from './User';

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - userId
 *         - birthDate
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do cliente
 *         userId:
 *           type: string
 *           description: ID do usuário associado ao cliente
 *         birthDate:
 *           type: string
 *           format: date
 *           description: Data de nascimento do cliente
 *         hasAllergy:
 *           type: boolean
 *           description: Indica se o cliente possui alergia de pele
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 */
export class Customer {
  private _id: string;
  private _userId: string;
  private _birthDate: Date;
  private _hasAllergy: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _user?: User | UserWithoutPassword;

  constructor(
    id: string,
    userId: string,
    birthDate: Date,
    hasAllergy: boolean,
    createdAt: Date,
    updatedAt: Date,
    user?: User | UserWithoutPassword
  ) {
    this._id = id;
    this._userId = userId;
    this._birthDate = birthDate;
    this._hasAllergy = hasAllergy;
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

  get birthDate(): Date {
    return this._birthDate;
  }

  get hasAllergy(): boolean {
    return this._hasAllergy;
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
   * Verifica se o cliente pode ser atendido com base nas regras de negócio
   * @returns true se o cliente pode ser atendido, false caso contrário
   */
  canBeServed(): boolean {
    return !this._hasAllergy && this.calculateAge() >= 3;
  }

  /**
   * Verifica se o cliente tem alergia de pele
   * @returns mensagem de erro se o cliente tem alergia, undefined caso contrário
   */
  validateAllergy(): string | undefined {
    if (this._hasAllergy) {
      return "Não é possível realizar o agendamento para clientes com alergia de pele";
    }
    return undefined;
  }

  /**
   * Verifica se o cliente tem idade mínima para atendimento
   * @returns mensagem de erro se o cliente é menor de 3 anos, undefined caso contrário
   */
  validateAge(): string | undefined {
    if (this.calculateAge() < 3) {
      return "Não realizamos cortes para crianças menores de 3 anos";
    }
    return undefined;
  }

  /**
   * Calcula a idade do cliente com base na data de nascimento
   * @returns a idade em anos
   */
  calculateAge(): number {
    const today = new Date();
    let age = today.getFullYear() - this._birthDate.getFullYear();
    const m = today.getMonth() - this._birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < this._birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // Factory method para criar um objeto Customer a partir de dados brutos
  static create(
    data: CustomerData,
    user?: User | UserWithoutPassword
  ): Customer {
    return new Customer(
      data.id,
      data.userId,
      data.birthDate,
      data.hasAllergy,
      data.createdAt,
      data.updatedAt,
      user
    );
  }

  // Converte o Customer para um objeto simples (para serialização/persistência)
  toJSON(): CustomerData {
    return {
      id: this._id,
      userId: this._userId,
      birthDate: this._birthDate,
      hasAllergy: this._hasAllergy,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      user: this._user
    };
  }
}

export interface CustomerData {
  id: string;
  userId: string;
  birthDate: Date;
  hasAllergy: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: User | UserWithoutPassword;
}

export interface CustomerWithUser {
  id: string;
  userId: string;
  birthDate: Date;
  hasAllergy: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: UserWithoutPassword;
}

export interface CreateCustomerDTO {
  userId: string;
  birthDate: Date;
  hasAllergy?: boolean;
}

export interface UpdateCustomerDTO {
  birthDate?: Date;
  hasAllergy?: boolean;
} 