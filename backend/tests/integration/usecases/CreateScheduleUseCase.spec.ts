import { CreateScheduleUseCase } from "../../../src/domain/usecases/schedule/CreateScheduleUseCase";
import { MockCustomerRepository, MockScheduleRepository, MockServiceRepository } from "../../mocks/repositories";
import { Schedule, ScheduleStatus } from "../../../src/domain/entities/Schedule";
import * as dateUtils from "../../../src/utils/dateUtils";
import { Customer } from "../../../src/domain/entities/Customer";

// Em vez de jest.mock, usamos spyOn direto no objeto dateUtils
const isHolidaySpy = jest.spyOn(dateUtils, 'isHoliday').mockReturnValue(false);

describe("CreateScheduleUseCase", () => {
  let createScheduleUseCase: CreateScheduleUseCase;
  let mockScheduleRepository: MockScheduleRepository;
  let mockCustomerRepository: MockCustomerRepository;
  let mockServiceRepository: MockServiceRepository;

  beforeEach(() => {
    mockScheduleRepository = new MockScheduleRepository();
    mockCustomerRepository = new MockCustomerRepository();
    mockServiceRepository = new MockServiceRepository();

    createScheduleUseCase = new CreateScheduleUseCase(
      mockScheduleRepository,
      mockCustomerRepository,
      mockServiceRepository
    );

    // Reseta o mock entre os testes
    jest.clearAllMocks();
    isHolidaySpy.mockReturnValue(false);
  });

  afterAll(() => {
    // Restaura os mocks
    jest.restoreAllMocks();
  });

  it("deve criar um agendamento com sucesso", async () => {
    // Preparação: data futura com mais de uma semana de antecedência
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10); // 10 dias à frente

    const scheduleData = {
      customerId: "customer-1",
      barberId: "barber-1",
      date: futureDate,
      serviceIds: ["service-1", "service-2"]
    };

    // Ação
    const result = await createScheduleUseCase.execute(scheduleData);

    // Verificação
    expect(result).toBeDefined();
    expect(result.customerId).toBe(scheduleData.customerId);
    expect(result.barberId).toBe(scheduleData.barberId);
    expect(result.date).toBe(scheduleData.date);
    expect(result.status).toBe(ScheduleStatus.PENDING);
  });

  it("deve rejeitar agendamento em feriado", async () => {
    // Preparação: simula que a data é um feriado
    isHolidaySpy.mockReturnValue(true);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);

    const scheduleData = {
      customerId: "customer-1",
      barberId: "barber-1",
      date: futureDate,
      serviceIds: ["service-1"]
    };

    // Ação e Verificação
    await expect(createScheduleUseCase.execute(scheduleData))
      .rejects
      .toThrow("Não é possível agendar em feriados");
  });

  it("deve rejeitar agendamento com menos de uma semana de antecedência", async () => {
    // Preparação: data com menos de uma semana de antecedência
    const nearDate = new Date();
    nearDate.setDate(nearDate.getDate() + 3); // 3 dias à frente
  
    const scheduleData = {
      customerId: "customer-1",
      barberId: "barber-1",
      date: nearDate,
      serviceIds: ["service-1"]
    };
  
    // Ação e Verificação
    await expect(createScheduleUseCase.execute(scheduleData))
      .rejects
      .toThrow("O agendamento deve ser feito com pelo menos uma semana de antecedência");
  });

  it("deve rejeitar agendamento para horário já confirmado", async () => {
    // Preparação: data futura
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    
    // Criamos um Schedule real em vez de apenas um objeto similar
    const conflictingSchedule = Schedule.create({
      id: "existing-schedule",
      customerId: "another-customer",
      barberId: "barber-1",
      date: futureDate,
      status: ScheduleStatus.CONFIRMED,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Simula um agendamento conflitante no repositório
    jest.spyOn(mockScheduleRepository, "findConflictingSchedules").mockResolvedValue([conflictingSchedule]);
  
    const scheduleData = {
      customerId: "customer-1",
      barberId: "barber-1",
      date: futureDate,
      serviceIds: ["service-1"]
    };
  
    // Ação e Verificação
    await expect(createScheduleUseCase.execute(scheduleData))
      .rejects
      .toThrow("Já existe um agendamento confirmado para o horário solicitado");
  });

  it("deve rejeitar agendamento para cliente não encontrado", async () => {
    // Preparação: cliente inexistente
    jest.spyOn(mockCustomerRepository, "findById").mockResolvedValue(null);
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
  
    const scheduleData = {
      customerId: "nonexistent-customer",
      barberId: "barber-1",
      date: futureDate,
      serviceIds: ["service-1"]
    };
  
    // Ação e Verificação
    await expect(createScheduleUseCase.execute(scheduleData))
      .rejects
      .toThrow("Cliente não encontrado");
  });

  it("deve rejeitar agendamento para cliente com alergia", async () => {
    // Preparação: cliente com alergia
    const baseCustomer = mockCustomerRepository.customers[0];
    const customerWithAllergy = Customer.create({
      id: baseCustomer.id,
      userId: baseCustomer.userId,
      birthDate: baseCustomer.birthDate,
      hasAllergy: true,
      createdAt: baseCustomer.createdAt,
      updatedAt: baseCustomer.updatedAt
    }, baseCustomer.user);
    
    jest.spyOn(mockCustomerRepository, "findById").mockResolvedValue(customerWithAllergy);
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
  
    const scheduleData = {
      customerId: "customer-1",
      barberId: "barber-1",
      date: futureDate,
      serviceIds: ["service-1"]
    };
  
    // Ação e Verificação
    await expect(createScheduleUseCase.execute(scheduleData))
      .rejects
      .toThrow("Não é possível realizar o agendamento para clientes com alergia de pele");
  });

  it("deve rejeitar agendamento para crianças menores de 3 anos", async () => {
    // Preparação: cliente menor de 3 anos
    const childBirthDate = new Date();
    childBirthDate.setFullYear(childBirthDate.getFullYear() - 2); // 2 anos atrás
    
    const baseCustomer = mockCustomerRepository.customers[0];
    const childCustomer = Customer.create({
      id: baseCustomer.id,
      userId: baseCustomer.userId,
      birthDate: childBirthDate,
      hasAllergy: baseCustomer.hasAllergy,
      createdAt: baseCustomer.createdAt,
      updatedAt: baseCustomer.updatedAt
    }, baseCustomer.user);
    
    jest.spyOn(mockCustomerRepository, "findById").mockResolvedValue(childCustomer);
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
  
    const scheduleData = {
      customerId: "customer-1",
      barberId: "barber-1",
      date: futureDate,
      serviceIds: ["service-1"]
    };
  
    // Ação e Verificação
    await expect(createScheduleUseCase.execute(scheduleData))
      .rejects
      .toThrow("Não realizamos cortes para crianças menores de 3 anos");
  });

  it("deve rejeitar agendamento com serviços inexistentes", async () => {
    // Preparação: serviço não encontrado
    jest.spyOn(mockServiceRepository, "findByIds").mockResolvedValue([]);
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
  
    const scheduleData = {
      customerId: "customer-1",
      barberId: "barber-1",
      date: futureDate,
      serviceIds: ["nonexistent-service"]
    };
  
    // Ação e Verificação
    await expect(createScheduleUseCase.execute(scheduleData))
      .rejects
      .toThrow("Um ou mais serviços solicitados não foram encontrados");
  });
}); 