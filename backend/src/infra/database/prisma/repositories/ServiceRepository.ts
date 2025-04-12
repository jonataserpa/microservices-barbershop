import { Service, CreateServiceDTO, UpdateServiceDTO, ServiceType } from "../../../../domain/entities/Service";
import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { prisma } from "../prismaClient";

export class ServiceRepository implements IServiceRepository {
  async findAll(): Promise<Service[]> {
    const services = await prisma.service.findMany();
    return services.map(service => this.mapPrismaServiceToDomain(service));
  }

  async findById(id: string): Promise<Service | null> {
    const service = await prisma.service.findUnique({
      where: { id }
    });

    if (!service) return null;

    return this.mapPrismaServiceToDomain(service);
  }

  async findByIds(ids: string[]): Promise<Service[]> {
    const services = await prisma.service.findMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    return services.map(service => this.mapPrismaServiceToDomain(service));
  }

  async findByName(name: string): Promise<Service[]> {
    const services = await prisma.service.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive'
        }
      }
    });

    return services.map(service => this.mapPrismaServiceToDomain(service));
  }

  async create(data: CreateServiceDTO): Promise<Service> {
    // Verifica se o campo type existe no schema
    const serviceData: any = {
      name: data.name,
      description: data.description,
      price: data.price,
      duration: data.duration
    };

    // Adiciona o campo type apenas se ele estiver definido
    if (data.type) {
      try {
        serviceData.type = data.type;
      } catch (error) {
        console.warn('Campo type não está disponível no modelo Service do Prisma');
      }
    }

    const service = await prisma.service.create({
      data: serviceData
    });

    return this.mapPrismaServiceToDomain(service);
  }

  async update(id: string, data: UpdateServiceDTO): Promise<Service> {
    // Prepara os dados para atualização, removendo o campo type se ele não existir no schema
    const updateData: any = { ...data };
    if (data.type) {
      try {
        updateData.type = data.type;
      } catch (error) {
        console.warn('Campo type não está disponível no modelo Service do Prisma');
        delete updateData.type;
      }
    }

    const service = await prisma.service.update({
      where: { id },
      data: updateData
    });

    return this.mapPrismaServiceToDomain(service);
  }

  async delete(id: string): Promise<void> {
    await prisma.service.delete({
      where: { id }
    });
  }

  // Função auxiliar para mapear um serviço do Prisma para o domínio
  private mapPrismaServiceToDomain(service: any): Service {
    const domainService: Service = {
      id: service.id,
      name: service.name,
      description: service.description || undefined,
      price: Number(service.price),
      duration: service.duration,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt
    };

    // Adiciona o campo type apenas se ele existir no serviço do Prisma
    if ('type' in service && service.type) {
      domainService.type = service.type as ServiceType;
    } else {
      // Tenta detectar o tipo pelo nome do serviço (compatibilidade com dados antigos)
      if (service.name.toLowerCase().includes('corte') && service.name.toLowerCase().includes('barba')) {
        domainService.type = ServiceType.COMBO;
      } else if (service.name.toLowerCase().includes('corte')) {
        domainService.type = ServiceType.HAIRCUT;
      } else if (service.name.toLowerCase().includes('barba')) {
        domainService.type = ServiceType.BEARD;
      } else {
        domainService.type = ServiceType.OTHER;
      }
    }

    return domainService;
  }
} 