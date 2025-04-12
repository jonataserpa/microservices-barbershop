import { Barber, BarberData, BarberWithUser, CreateBarberDTO, UpdateBarberDTO } from "../../../../domain/entities/Barber";
import { UserRole, UserWithoutPassword } from "../../../../domain/entities/User";
import { IBarberRepository } from "../../../../domain/repositories/IBarberRepository";
import { prisma } from "../prismaClient";

export class BarberRepository implements IBarberRepository {
  async findAll(): Promise<BarberWithUser[]> {
    const barbers = await prisma.barber.findMany({
      include: {
        user: true
      }
    });

    return barbers.map(barber => ({
      id: barber.id,
      userId: barber.userId,
      specialty: barber.specialty || undefined,
      createdAt: barber.createdAt,
      updatedAt: barber.updatedAt,
      user: {
        id: barber.user.id,
        name: barber.user.name,
        email: barber.user.email,
        role: this.mapUserRole(barber.user.role),
        createdAt: barber.user.createdAt,
        updatedAt: barber.user.updatedAt,
      }
    }));
  }

  async findById(id: string): Promise<Barber | null> {
    const barber = await prisma.barber.findUnique({
      where: { id },
      include: {
        user: true
      }
    });

    if (!barber) return null;

    const userData: UserWithoutPassword = {
      id: barber.user.id,
      name: barber.user.name,
      email: barber.user.email,
      role: this.mapUserRole(barber.user.role),
      createdAt: barber.user.createdAt,
      updatedAt: barber.user.updatedAt,
    };

    const barberData: BarberData = {
      id: barber.id,
      userId: barber.userId,
      specialty: barber.specialty || undefined,
      createdAt: barber.createdAt,
      updatedAt: barber.updatedAt
    };

    return Barber.create(barberData, userData);
  }

  async findByUserId(userId: string): Promise<Barber | null> {
    const barber = await prisma.barber.findUnique({
      where: { userId },
      include: {
        user: true
      }
    });

    if (!barber) return null;

    const userData: UserWithoutPassword = {
      id: barber.user.id,
      name: barber.user.name,
      email: barber.user.email,
      role: this.mapUserRole(barber.user.role),
      createdAt: barber.user.createdAt,
      updatedAt: barber.user.updatedAt,
    };

    const barberData: BarberData = {
      id: barber.id,
      userId: barber.userId,
      specialty: barber.specialty || undefined,
      createdAt: barber.createdAt,
      updatedAt: barber.updatedAt
    };

    return Barber.create(barberData, userData);
  }

  async create(data: CreateBarberDTO): Promise<Barber> {
    const barber = await prisma.barber.create({
      data: {
        userId: data.userId,
        specialty: data.specialty
      },
      include: {
        user: true
      }
    });

    const userData = barber.user ? {
      id: barber.user.id,
      name: barber.user.name,
      email: barber.user.email,
      role: this.mapUserRole(barber.user.role),
      createdAt: barber.user.createdAt,
      updatedAt: barber.user.updatedAt,
    } : undefined;

    const barberData: BarberData = {
      id: barber.id,
      userId: barber.userId,
      specialty: barber.specialty || undefined,
      createdAt: barber.createdAt,
      updatedAt: barber.updatedAt
    };

    return Barber.create(barberData, userData);
  }

  async update(id: string, data: UpdateBarberDTO): Promise<Barber> {
    const barber = await prisma.barber.update({
      where: { id },
      data: {
        specialty: data.specialty
      },
      include: {
        user: true
      }
    });

    const userData = barber.user ? {
      id: barber.user.id,
      name: barber.user.name,
      email: barber.user.email,
      role: this.mapUserRole(barber.user.role),
      createdAt: barber.user.createdAt,
      updatedAt: barber.user.updatedAt,
    } : undefined;

    const barberData: BarberData = {
      id: barber.id,
      userId: barber.userId,
      specialty: barber.specialty || undefined,
      createdAt: barber.createdAt,
      updatedAt: barber.updatedAt
    };

    return Barber.create(barberData, userData);
  }

  async delete(id: string): Promise<void> {
    await prisma.barber.delete({
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
        return UserRole.BARBER;
    }
  }
} 