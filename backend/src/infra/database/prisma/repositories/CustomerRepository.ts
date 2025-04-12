import { CreateCustomerDTO, Customer, CustomerData, CustomerWithUser, UpdateCustomerDTO } from "../../../../domain/entities/Customer";
import { User, UserRole, UserWithoutPassword } from "../../../../domain/entities/User";
import { ICustomerRepository } from "../../../../domain/repositories/ICustomerRepository";
import { prisma } from "../prismaClient";

export class CustomerRepository implements ICustomerRepository {
  async findAll(): Promise<Customer[]> {
    const customers = await prisma.customer.findMany({
      include: {
        user: true
      }
    });

    return customers.map(customer => Customer.create({
      id: customer.id,
      userId: customer.userId,
      birthDate: customer.birthDate,
      hasAllergy: customer.hasAllergy,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    }, {
      id: customer.user.id,
      name: customer.user.name,
      email: customer.user.email,
      role: this.mapUserRole(customer.user.role),
      createdAt: customer.user.createdAt,
      updatedAt: customer.user.updatedAt,
    }));
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        user: true
      }
    });

    if (!customer) return null;

    return Customer.create({
      id: customer.id,
      userId: customer.userId,
      birthDate: customer.birthDate,
      hasAllergy: customer.hasAllergy,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    }, {
      id: customer.user.id,
      name: customer.user.name,
      email: customer.user.email,
      role: this.mapUserRole(customer.user.role),
      createdAt: customer.user.createdAt,
      updatedAt: customer.user.updatedAt,
    });
  }

  async findByUserId(userId: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({
      where: { userId },
      include: {
        user: true
      }
    });

    if (!customer) return null;

    return Customer.create({
      id: customer.id,
      userId: customer.userId,
      birthDate: customer.birthDate,
      hasAllergy: customer.hasAllergy,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    }, {
      id: customer.user.id,
      name: customer.user.name,
      email: customer.user.email,
      role: this.mapUserRole(customer.user.role),
      createdAt: customer.user.createdAt,
      updatedAt: customer.user.updatedAt,
    });
  }

  async create(data: CreateCustomerDTO): Promise<Customer> {
    const customer = await prisma.customer.create({
      data: {
        userId: data.userId,
        birthDate: data.birthDate,
        hasAllergy: data.hasAllergy || false
      },
      include: {
        user: true
      }
    });

    return Customer.create({
      id: customer.id,
      userId: customer.userId,
      birthDate: customer.birthDate,
      hasAllergy: customer.hasAllergy,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    }, customer.user ? {
      id: customer.user.id,
      name: customer.user.name,
      email: customer.user.email,
      role: this.mapUserRole(customer.user.role),
      createdAt: customer.user.createdAt,
      updatedAt: customer.user.updatedAt,
    } : undefined);
  }

  async update(id: string, data: UpdateCustomerDTO): Promise<Customer> {
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        birthDate: data.birthDate,
        hasAllergy: data.hasAllergy
      },
      include: {
        user: true
      }
    });

    return Customer.create({
      id: customer.id,
      userId: customer.userId,
      birthDate: customer.birthDate,
      hasAllergy: customer.hasAllergy,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    }, customer.user ? {
      id: customer.user.id,
      name: customer.user.name,
      email: customer.user.email,
      role: this.mapUserRole(customer.user.role),
      createdAt: customer.user.createdAt,
      updatedAt: customer.user.updatedAt,
    } : undefined);
  }

  async delete(id: string): Promise<void> {
    await prisma.customer.delete({
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