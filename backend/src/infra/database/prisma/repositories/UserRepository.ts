import { CreateUserDTO, UpdateUserDTO, User, UserRole } from "../../../../domain/entities/User";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { prisma } from "../prismaClient";

export class UserRepository implements IUserRepository {
  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany();
    
    return users.map(user => ({
      ...user,
      role: this.mapUserRole(user.role)
    }));
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) return null;

    return {
      ...user,
      role: this.mapUserRole(user.role)
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) return null;

    return {
      ...user,
      role: this.mapUserRole(user.role)
    };
  }

  async create(data: CreateUserDTO): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role || UserRole.CUSTOMER
      }
    });

    return {
      ...user,
      role: this.mapUserRole(user.role)
    };
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data
    });

    return {
      ...user,
      role: this.mapUserRole(user.role)
    };
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id }
    });
  }

  // Função auxiliar para mapear os enums do Prisma para os enums do domínio
  private mapUserRole(role: any): UserRole {
    switch(role) {
      case 'ADMIN':
        return UserRole.ADMIN;
      case 'BARBER':
        return UserRole.BARBER;
      case 'CUSTOMER':
        return UserRole.CUSTOMER;
      default:
        return UserRole.CUSTOMER;
    }
  }
} 