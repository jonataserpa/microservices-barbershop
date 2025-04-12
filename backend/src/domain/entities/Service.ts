/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - duration
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do serviço
 *         name:
 *           type: string
 *           description: Nome do serviço
 *         description:
 *           type: string
 *           description: Descrição detalhada do serviço
 *         price:
 *           type: number
 *           format: float
 *           description: Preço do serviço em reais
 *         duration:
 *           type: integer
 *           description: Duração do serviço em minutos
 *         type:
 *           $ref: '#/components/schemas/ServiceType'
 *           description: Tipo do serviço
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 */

export class Service {
  private _id: string;
  private _name: string;
  private _description?: string;
  private _price: number;
  private _duration: number;
  private _type?: ServiceType;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    name: string,
    price: number,
    duration: number,
    createdAt: Date,
    updatedAt: Date,
    description?: string,
    type?: ServiceType
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._price = price;
    this._duration = duration;
    this._type = type || this.detectTypeFromName(name);
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | undefined {
    return this._description;
  }

  get price(): number {
    return this._price;
  }

  get duration(): number {
    return this._duration;
  }

  get type(): ServiceType | undefined {
    return this._type;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos de domínio (regras de negócio)

  /**
   * Detecta o tipo do serviço com base no nome
   * @param name Nome do serviço
   * @returns Tipo do serviço detectado
   */
  private detectTypeFromName(name: string): ServiceType {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('corte') && lowerName.includes('barba')) {
      return ServiceType.COMBO;
    } else if (lowerName.includes('corte')) {
      return ServiceType.HAIRCUT;
    } else if (lowerName.includes('barba')) {
      return ServiceType.BEARD;
    } else {
      return ServiceType.OTHER;
    }
  }

  /**
   * Calcula o preço com base no tipo do serviço
   * @returns Preço do serviço conforme o tipo
   */
  getStandardPrice(): number {
    if (!this._type) {
      return this._price;
    }
    
    return ServicePrices[this._type];
  }

  /**
   * Verifica se o serviço é um combo (corte + barba)
   * @returns true se o serviço é um combo
   */
  isCombo(): boolean {
    return this._type === ServiceType.COMBO;
  }

  /**
   * Verifica se o serviço inclui corte de cabelo
   * @returns true se o serviço inclui corte de cabelo
   */
  includesHaircut(): boolean {
    return this._type === ServiceType.HAIRCUT || this._type === ServiceType.COMBO;
  }

  /**
   * Verifica se o serviço inclui barba
   * @returns true se o serviço inclui barba
   */
  includesBeard(): boolean {
    return this._type === ServiceType.BEARD || this._type === ServiceType.COMBO;
  }

  /**
   * Calcula o preço total para uma lista de serviços, aplicando regras de combo
   * @param services Lista de serviços
   * @returns Preço total
   */
  static calculateTotalPrice(services: Service[]): number {
    if (!services.length) {
      return 0;
    }
    
    // Verifica se há algum serviço do tipo COMBO
    for (const service of services) {
      if (service.type === ServiceType.COMBO) {
        return ServicePrices[ServiceType.COMBO];
      }
    }
    
    // Identifica os tipos de serviço
    let hasHaircut = false;
    let hasBeard = false;
    
    for (const service of services) {
      if (service.type === ServiceType.HAIRCUT) {
        hasHaircut = true;
      } else if (service.type === ServiceType.BEARD) {
        hasBeard = true;
      }
    }
    
    // Aplica preço de combo se tiver corte e barba
    if (hasHaircut && hasBeard) {
      return ServicePrices[ServiceType.COMBO];
    }
    
    // Caso contrário, soma os preços individuais
    let total = 0;
    
    if (hasHaircut) {
      total += ServicePrices[ServiceType.HAIRCUT];
    }
    
    if (hasBeard) {
      total += ServicePrices[ServiceType.BEARD];
    }
    
    // Se não for corte nem barba, soma os preços normais
    if (!hasHaircut && !hasBeard) {
      total = services.reduce((sum, service) => sum + service.price, 0);
    }
    
    return total;
  }

  // Factory method para criar um objeto Service a partir de dados brutos
  static create(data: ServiceData): Service {
    return new Service(
      data.id,
      data.name,
      data.price,
      data.duration,
      data.createdAt,
      data.updatedAt,
      data.description,
      data.type
    );
  }

  // Converte o Service para um objeto simples (para serialização/persistência)
  toJSON(): ServiceData {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      price: this._price,
      duration: this._duration,
      type: this._type,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}

export interface ServiceData {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  type?: ServiceType;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceDTO {
  name: string;
  description?: string;
  price: number;
  duration: number;
  type?: ServiceType;
}

export interface UpdateServiceDTO {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  type?: ServiceType;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceType:
 *       type: string
 *       enum:
 *         - HAIRCUT
 *         - BEARD
 *         - COMBO
 *         - OTHER
 *       description: Tipos de serviços oferecidos
 */
export enum ServiceType {
  HAIRCUT = 'HAIRCUT',
  BEARD = 'BEARD',
  COMBO = 'COMBO',
  OTHER = 'OTHER',
}

export const ServicePrices = {
  [ServiceType.HAIRCUT]: 45.0,
  [ServiceType.BEARD]: 50.0,
  [ServiceType.COMBO]: 75.0,
  [ServiceType.OTHER]: 0.0, // O preço para outros serviços deve ser definido individualmente
}; 