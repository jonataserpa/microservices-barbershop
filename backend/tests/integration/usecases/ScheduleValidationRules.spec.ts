import { CreateScheduleUseCase } from "../../../src/domain/usecases/schedule/CreateScheduleUseCase";
import { MockCustomerRepository, MockScheduleRepository, MockServiceRepository } from "../../mocks/repositories";
import { isHoliday } from "../../../src/utils/dateUtils";
import { CustomerWithUser } from "../../../src/domain/entities/Customer";
import { ScheduleStatus } from "../../../src/domain/entities/Schedule";

jest.mock("../../../src/utils/dateUtils", () => ({
  isHoliday: jest.fn().mockReturnValue(false)
}));

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

    // Cria a instância do caso de uso
    createScheduleUseCase = new CreateScheduleUseCase(
      mockScheduleRepository,
      mockCustomerRepository,
      mockServiceRepository
    );

    // Reseta o mock da função isHoliday
    (isHoliday as jest.Mock).mockClear();
    (isHoliday as jest.Mock).mockReturnValue(false);
  });

  // Testes de casos inválidos
  describe("Casos Inválidos", () => {
    // Teste para a regra: Não agendar em feriados
    it("1. Não deve permitir agendamento em feriados", async () => {
      // Configura o mock para simular um feriado
      (isHoliday as jest.Mock).mockReturnValue(true);
      
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
      
      // Simula um agendamento existente
      jest.spyOn(mockScheduleRepository, "findConflictingSchedules").mockResolvedValue([
        {
          id: "existing-schedule",
          customerId: "another-customer",
          barberId: "barber-1",
          date: futureDate,
          status: ScheduleStatus.CONFIRMED,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      
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
      // Cria um mock de cliente com alergia
      const customerWithAllergy: CustomerWithUser = {
        ...mockCustomerRepository.customers[0],
        hasAllergy: true
      };
      
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
      
      // Cria um mock de cliente menor de 3 anos
      const childCustomer: CustomerWithUser = {
        ...mockCustomerRepository.customers[0],
        birthDate: childBirthDate
      };
      
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
      
      // Serviços existentes
      jest.spyOn(mockServiceRepository, "findByIds").mockResolvedValue(mockServiceRepository.services);
      
      // Não é feriado
      (isHoliday as jest.Mock).mockReturnValue(false);
      
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