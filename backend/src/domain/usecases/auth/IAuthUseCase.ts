import { User } from '../../entities/User';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  birthDate?: Date;
  hasAllergy?: boolean;
  specialty?: string;
  role?: 'CUSTOMER' | 'BARBER';
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface IAuthUseCase {
  login(data: LoginDTO): Promise<AuthResponse>;
  register(data: RegisterDTO): Promise<AuthResponse>;
} 