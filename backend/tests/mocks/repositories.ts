import { IScheduleRepository } from "../../src/domain/repositories/IScheduleRepository";
import { ICustomerRepository } from "../../src/domain/repositories/ICustomerRepository";
import { IServiceRepository } from "../../src/domain/repositories/IServiceRepository";
import { IBarberRepository } from "../../src/domain/repositories/IBarberRepository";
import { IUserRepository } from "../../src/domain/repositories/IUserRepository";
import { Customer, CustomerWithUser } from "../../src/domain/entities/Customer";
import { User, UserRole } from "../../src/domain/entities/User";
import { Service, ServiceType } from "../../src/domain/entities/Service";
import { Schedule, ScheduleStatus, ScheduleWithRelations } from "../../src/domain/entities/Schedule";
import { Barber, BarberWithUser } from "../../src/domain/entities/Barber";

// Mock de usuário para testes
export const mockUser: User = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  role: UserRole.CUSTOMER,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Mock de cliente para testes
export const mockCustomerWithUser: CustomerWithUser = {
  id: "customer-1",
  userId: "user-1",
  birthDate: new Date("1990-01-01"),
  hasAllergy: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  user: mockUser
};

// Mock de barbeiro para testes
export const mockBarberWithUser: BarberWithUser = {
  id: "barber-1",
  userId: "user-2",
  specialty: "Cortes modernos",
  createdAt: new Date(),
  updatedAt: new Date(),
  user: {
    ...mockUser,
    id: "user-2",
    role: UserRole.BARBER,
    email: "barber@example.com"
  }
};

// Mock de serviço para testes
export const mockServices: Service[] = [
  {
    id: "service-1",
    name: "Corte de Cabelo",
    description: "Corte tradicional",
    price: 45,
    duration: 30,
    type: ServiceType.HAIRCUT,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "service-2",
    name: "Barba",
    description: "Modelagem de barba",
    price: 50,
    duration: 20,
    type: ServiceType.BEARD,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "service-3",
    name: "Combo Corte + Barba",
    description: "Combo promocional",
    price: 75,
    duration: 50,
    type: ServiceType.COMBO,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "service-4",
    name: "Hidratação",
    description: "Tratamento capilar",
    price: 60,
    duration: 40,
    type: ServiceType.OTHER,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock de agendamento para testes
export const mockSchedule: Schedule = {
  id: "schedule-1",
  customerId: "customer-1",
  barberId: "barber-1",
  date: new Date(),
  status: ScheduleStatus.PENDING,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Mock do repositório de usuários
export class MockUserRepository implements IUserRepository {
  users: User[] = [mockUser];

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async create(data: any): Promise<User> {
    const newUser: User = {
      id: `user-${this.users.length + 1}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || UserRole.CUSTOMER,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  async update(id: string, data: any): Promise<User> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) throw new Error("Usuário não encontrado");
    
    const updatedUser = { ...this.users[index], ...data, updatedAt: new Date() };
    this.users[index] = updatedUser;
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }
}

// Mock do repositório de clientes
export class MockCustomerRepository implements ICustomerRepository {
  customers: CustomerWithUser[] = [mockCustomerWithUser];

  async findAll(): Promise<CustomerWithUser[]> {
    return this.customers;
  }

  async findById(id: string): Promise<CustomerWithUser | null> {
    return this.customers.find(customer => customer.id === id) || null;
  }

  async findByUserId(userId: string): Promise<CustomerWithUser | null> {
    return this.customers.find(customer => customer.userId === userId) || null;
  }

  async create(data: any): Promise<Customer> {
    const newCustomer: CustomerWithUser = {
      id: `customer-${this.customers.length + 1}`,
      userId: data.userId,
      birthDate: data.birthDate,
      hasAllergy: data.hasAllergy || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: mockUser // simplificação para testes
    };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  async update(id: string, data: any): Promise<Customer> {
    const index = this.customers.findIndex(customer => customer.id === id);
    if (index === -1) throw new Error("Cliente não encontrado");
    
    const updatedCustomer = { ...this.customers[index], ...data, updatedAt: new Date() };
    this.customers[index] = updatedCustomer;
    return updatedCustomer;
  }

  async delete(id: string): Promise<void> {
    const index = this.customers.findIndex(customer => customer.id === id);
    if (index !== -1) {
      this.customers.splice(index, 1);
    }
  }
}

// Mock do repositório de barbeiros
export class MockBarberRepository implements IBarberRepository {
  barbers: BarberWithUser[] = [mockBarberWithUser];

  async findAll(): Promise<BarberWithUser[]> {
    return this.barbers;
  }

  async findById(id: string): Promise<BarberWithUser | null> {
    return this.barbers.find(barber => barber.id === id) || null;
  }

  async findByUserId(userId: string): Promise<BarberWithUser | null> {
    return this.barbers.find(barber => barber.userId === userId) || null;
  }

  async create(data: any): Promise<Barber> {
    const newBarber: BarberWithUser = {
      id: `barber-${this.barbers.length + 1}`,
      userId: data.userId,
      specialty: data.specialty,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        ...mockUser,
        id: data.userId,
        role: UserRole.BARBER
      }
    };
    this.barbers.push(newBarber);
    return newBarber;
  }

  async update(id: string, data: any): Promise<Barber> {
    const index = this.barbers.findIndex(barber => barber.id === id);
    if (index === -1) throw new Error("Barbeiro não encontrado");
    
    const updatedBarber = { ...this.barbers[index], ...data, updatedAt: new Date() };
    this.barbers[index] = updatedBarber;
    return updatedBarber;
  }

  async delete(id: string): Promise<void> {
    const index = this.barbers.findIndex(barber => barber.id === id);
    if (index !== -1) {
      this.barbers.splice(index, 1);
    }
  }
}

// Mock do repositório de serviços
export class MockServiceRepository implements IServiceRepository {
  services: Service[] = [...mockServices];

  async findAll(): Promise<Service[]> {
    return this.services;
  }

  async findById(id: string): Promise<Service | null> {
    return this.services.find(service => service.id === id) || null;
  }

  async findByIds(ids: string[]): Promise<Service[]> {
    return this.services.filter(service => ids.includes(service.id));
  }

  async findByName(name: string): Promise<Service[]> {
    return this.services.filter(service => 
      service.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  async create(data: any): Promise<Service> {
    const newService: Service = {
      id: `service-${this.services.length + 1}`,
      name: data.name,
      description: data.description,
      price: data.price,
      duration: data.duration,
      type: data.type,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.services.push(newService);
    return newService;
  }

  async update(id: string, data: any): Promise<Service> {
    const index = this.services.findIndex(service => service.id === id);
    if (index === -1) throw new Error("Serviço não encontrado");
    
    const updatedService = { ...this.services[index], ...data, updatedAt: new Date() };
    this.services[index] = updatedService;
    return updatedService;
  }

  async delete(id: string): Promise<void> {
    const index = this.services.findIndex(service => service.id === id);
    if (index !== -1) {
      this.services.splice(index, 1);
    }
  }
}

// Mock do repositório de agendamentos
export class MockScheduleRepository implements IScheduleRepository {
  schedules: Schedule[] = [mockSchedule];

  async findAll(): Promise<ScheduleWithRelations[]> {
    return this.schedules.map(schedule => ({
      ...schedule,
      customer: mockCustomerWithUser,
      barber: mockBarberWithUser,
      services: []
    }));
  }

  async findById(id: string): Promise<ScheduleWithRelations | null> {
    const schedule = this.schedules.find(schedule => schedule.id === id);
    if (!schedule) return null;
    
    return {
      ...schedule,
      customer: mockCustomerWithUser,
      barber: mockBarberWithUser,
      services: []
    };
  }

  async findByCustomerId(customerId: string): Promise<ScheduleWithRelations[]> {
    return this.schedules
      .filter(schedule => schedule.customerId === customerId)
      .map(schedule => ({
        ...schedule,
        customer: mockCustomerWithUser,
        barber: mockBarberWithUser,
        services: []
      }));
  }

  async findByBarberId(barberId: string): Promise<ScheduleWithRelations[]> {
    return this.schedules
      .filter(schedule => schedule.barberId === barberId)
      .map(schedule => ({
        ...schedule,
        customer: mockCustomerWithUser,
        barber: mockBarberWithUser,
        services: []
      }));
  }

  async findByDate(date: Date): Promise<ScheduleWithRelations[]> {
    const dateString = date.toDateString();
    
    return this.schedules
      .filter(schedule => schedule.date.toDateString() === dateString)
      .map(schedule => ({
        ...schedule,
        customer: mockCustomerWithUser,
        barber: mockBarberWithUser,
        services: []
      }));
  }

  async findConflictingSchedules(barberId: string, date: Date): Promise<Schedule[]> {
    // Para testes, considera-se conflito um agendamento no mesmo dia e horário (hora e minuto)
    return this.schedules.filter(schedule => 
      schedule.barberId === barberId &&
      schedule.status === ScheduleStatus.CONFIRMED &&
      schedule.date.getFullYear() === date.getFullYear() &&
      schedule.date.getMonth() === date.getMonth() &&
      schedule.date.getDate() === date.getDate() &&
      schedule.date.getHours() === date.getHours() &&
      schedule.date.getMinutes() === date.getMinutes()
    );
  }

  async create(data: any): Promise<Schedule> {
    const newSchedule: Schedule = {
      id: `schedule-${this.schedules.length + 1}`,
      customerId: data.customerId,
      barberId: data.barberId,
      date: data.date,
      status: ScheduleStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.schedules.push(newSchedule);
    return newSchedule;
  }

  async update(id: string, data: any): Promise<Schedule> {
    const index = this.schedules.findIndex(schedule => schedule.id === id);
    if (index === -1) throw new Error("Agendamento não encontrado");
    
    const updatedSchedule = { 
      ...this.schedules[index], 
      ...data, 
      updatedAt: new Date() 
    };
    this.schedules[index] = updatedSchedule;
    return updatedSchedule;
  }

  async delete(id: string): Promise<void> {
    const index = this.schedules.findIndex(schedule => schedule.id === id);
    if (index !== -1) {
      this.schedules.splice(index, 1);
    }
  }
} 