import { CreateScheduleUseCase } from "../../../src/domain/usecases/schedule/CreateScheduleUseCase";
import { MockCustomerRepository, MockScheduleRepository, MockServiceRepository, mockServices } from "../../mocks/repositories";
import * as dateUtils from "../../../src/utils/dateUtils";
import { Customer, CustomerWithUser } from "../../../src/domain/entities/Customer";
import { Schedule, ScheduleStatus } from "../../../src/domain/entities/Schedule";
import { Service, ServiceType } from "../../../src/domain/entities/Service";

// Em vez de substituir a função, vamos criar um spy para controlar seu comportamento
const isHolidaySpy = jest.spyOn(dateUtils, 'isHoliday').mockReturnValue(false);

/**
 * Teste de integração para validar as regras de negócio relacionadas aos agendamentos
 * 
 * Regras testadas:
 * 1. Não permitir agendar em feriados
 * 2. Não permitir agendar com menos de uma semana de antecedência
 * 3. Não permitir agendar no mesmo horário de outro agendamento confirmado
 * 4. Não permitir agendar para clientes com alergia de pele
 * 5. Não permitir agendar para crianças menores de 3 anos
 */
describe("Regras de Negócio para Agendamentos", () => {
  let createScheduleUseCase: CreateScheduleUseCase;
  let mockScheduleRepository: MockScheduleRepository;
  let mockCustomerRepository: MockCustomerRepository;
  let mockServiceRepository: MockServiceRepository;

  beforeEach(() => {
    // Prepara os mocks
    mockScheduleRepository = new MockScheduleRepository();
    mockCustomerRepository = new MockCustomerRepository();
    mockServiceRepository = new MockServiceRepository();

    // Configura o mock para sempre encontrar os serviços solicitados
    jest.spyOn(mockServiceRepository, "findByIds").mockImplementation(
      (ids: string[]): Promise<Service[]> => {
        // Para cada ID na lista, cria ou recupera um serviço correspondente
        const services = ids.map(id => {
          const existingService = mockServiceRepository.services.find(s => s.id === id);
          if (existingService) return existingService;

          // Se o serviço não existe, criamos um novo objeto Service com o ID solicitado
          return Service.create({
            id: id,
            name: "Serviço Temporário",
            description: "Criado para teste",
            price: 50,
            duration: 30,
            type: ServiceType.OTHER,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        });
        return Promise.resolve(services);
      }
    );

    // Cria a instância do caso de uso
    createScheduleUseCase = new CreateScheduleUseCase(
      mockScheduleRepository,
      mockCustomerRepository,
      mockServiceRepository
    );

    // Reseta o mock da função isHoliday
    jest.clearAllMocks();
    isHolidaySpy.mockReturnValue(false);
  });

  afterAll(() => {
    // Restaura todos os mocks
    jest.restoreAllMocks();
  });

  // Testes de casos inválidos
  describe("Casos Inválidos", () => {
    // Teste para a regra: Não agendar em feriados
    it("1. Não deve permitir agendamento em feriados", async () => {
      // Configura o mock para simular um feriado
      isHolidaySpy.mockReturnValue(true);
      
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      
      const scheduleData = {
        customerId: "customer-1",
        barberId: "barber-1",
        date: futureDate,
        serviceIds: ["service-1"]
      };
      
      // Verifica se a exceção é lançada corretamente
      await expect(createScheduleUseCase.execute(scheduleData))
        .rejects
        .toThrow("Não é possível agendar em feriados");
    });

    // Teste para a regra: Não agendar com menos de uma semana de antecedência
    it("2. Não deve permitir agendamento com menos de uma semana de antecedência", async () => {
      // Data com apenas 3 dias de antecedência
      const nearDate = new Date();
      nearDate.setDate(nearDate.getDate() + 3);
      
      const scheduleData = {
        customerId: "customer-1",
        barberId: "barber-1",
        date: nearDate,
        serviceIds: ["service-1"]
      };
      
      await expect(createScheduleUseCase.execute(scheduleData))
        .rejects
        .toThrow("O agendamento deve ser feito com pelo menos uma semana de antecedência");
    });

    // Teste para a regra: Não agendar no mesmo horário de outro agendamento confirmado
    it("3. Não deve permitir agendamento no mesmo horário de outro já confirmado", async () => {
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
      
      // Simula um agendamento existente
      jest.spyOn(mockScheduleRepository, "findConflictingSchedules").mockResolvedValue([conflictingSchedule]);
      
      const scheduleData = {
        customerId: "customer-1",
        barberId: "barber-1",
        date: futureDate,
        serviceIds: ["service-1"]
      };
      
      await expect(createScheduleUseCase.execute(scheduleData))
        .rejects
        .toThrow("Já existe um agendamento confirmado para o horário solicitado");
    });

    // Teste para a regra: Não atender clientes com alergia de pele
    it("4. Não deve permitir agendamento para clientes com alergia de pele", async () => {
      // Criamos um cliente real com alergia
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
      
      await expect(createScheduleUseCase.execute(scheduleData))
        .rejects
        .toThrow("Não é possível realizar o agendamento para clientes com alergia de pele");
    });

    // Teste para a regra: Não realizar corte para crianças menores de 3 anos
    it("5. Não deve permitir agendamento para crianças menores de 3 anos", async () => {
      // Data de nascimento de uma criança de 2 anos
      const childBirthDate = new Date();
      childBirthDate.setFullYear(childBirthDate.getFullYear() - 2);
      
      // Criamos um cliente real menor de 3 anos
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
      
      await expect(createScheduleUseCase.execute(scheduleData))
        .rejects
        .toThrow("Não realizamos cortes para crianças menores de 3 anos");
    });

    // Teste específico para verificar o comportamento quando um serviço não é encontrado
    it("6. Deve lançar erro quando um serviço não é encontrado", async () => {
      // Anulamos o mock global para usar um comportamento específico neste teste
      jest.spyOn(mockServiceRepository, "findByIds").mockResolvedValue([]);

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      
      const scheduleData = {
        customerId: "customer-1",
        barberId: "barber-1",
        date: futureDate,
        serviceIds: ["service-inexistente"]
      };
      
      await expect(createScheduleUseCase.execute(scheduleData))
        .rejects
        .toThrow("Um ou mais serviços solicitados não foram encontrados");
    });
  });

  // Testes de casos válidos
  describe("Casos Válidos", () => {
    it("Deve criar um agendamento quando todas as regras forem atendidas", async () => {
      // Data futura com mais de uma semana de antecedência
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      
      // Cliente adulto sem alergia
      const adultCustomer = mockCustomerRepository.customers[0];
      jest.spyOn(mockCustomerRepository, "findById").mockResolvedValue(adultCustomer);
      
      // Não há conflito de horário
      jest.spyOn(mockScheduleRepository, "findConflictingSchedules").mockResolvedValue([]);
      
      // Não é feriado
      isHolidaySpy.mockReturnValue(false);
      
      const scheduleData = {
        customerId: "customer-1",
        barberId: "barber-1",
        date: futureDate,
        serviceIds: ["service-1", "service-2"]
      };
      
      const result = await createScheduleUseCase.execute(scheduleData);
      
      // Verificações
      expect(result).toBeDefined();
      expect(result.customerId).toBe(scheduleData.customerId);
      expect(result.barberId).toBe(scheduleData.barberId);
      expect(result.date).toBe(scheduleData.date);
      expect(result.status).toBe(ScheduleStatus.PENDING);
    });
  });
}); 