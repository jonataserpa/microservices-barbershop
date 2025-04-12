import { IBarberRepository } from "../../domain/repositories/IBarberRepository";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRepository";
import { IScheduleRepository } from "../../domain/repositories/IScheduleRepository";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { prisma } from "./prisma/prismaClient";
import {
  BarberRepository,
  CustomerRepository,
  ScheduleRepository,
  ServiceRepository,
  UserRepository
} from "./prisma/repositories";

// Repositórios
const userRepository: IUserRepository = new UserRepository();
const customerRepository: ICustomerRepository = new CustomerRepository();
const barberRepository: IBarberRepository = new BarberRepository();
const serviceRepository: IServiceRepository = new ServiceRepository();
const scheduleRepository: IScheduleRepository = new ScheduleRepository();

// Função para fechar a conexão com o banco de dados
const disconnect = async (): Promise<void> => {
  await prisma.$disconnect();
};

export {
  userRepository,
  customerRepository,
  barberRepository,
  serviceRepository,
  scheduleRepository,
  disconnect
}; 