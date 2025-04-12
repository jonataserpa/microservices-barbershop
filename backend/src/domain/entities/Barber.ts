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
export interface Barber {
  id: string;
  userId: string;
  specialty?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User | UserWithoutPassword;
}

export interface BarberWithUser extends Omit<Barber, 'user'> {
  user: UserWithoutPassword;
}

export interface CreateBarberDTO {
  userId: string;
  specialty?: string;
}

export interface UpdateBarberDTO {
  specialty?: string;
} 