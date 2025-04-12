import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../../repositories/IUserRepository';
import { ICustomerRepository } from '../../repositories/ICustomerRepository';
import { IBarberRepository } from '../../repositories/IBarberRepository';
import { IAuthUseCase, LoginDTO, RegisterDTO, AuthResponse } from './IAuthUseCase';
import { UserRole } from '../../entities/User';

export class AuthUseCase implements IAuthUseCase {
  constructor(
    private userRepository: IUserRepository,
    private customerRepository: ICustomerRepository,
    private barberRepository: IBarberRepository,
  ) {}

  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new Error('Senha inválida');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
    );

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const role = data.role || UserRole.CUSTOMER;

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role,
    });

    if (role === UserRole.CUSTOMER && data.birthDate) {
      await this.customerRepository.create({
        userId: user.id,
        birthDate: data.birthDate,
        hasAllergy: data.hasAllergy || false,
      });
    } else if (role === UserRole.BARBER) {
      await this.barberRepository.create({
        userId: user.id,
        specialty: data.specialty,
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
    );

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
} 