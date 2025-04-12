import { CalculateServicePriceUseCase } from "../../../src/domain/usecases/service/CalculateServicePriceUseCase";
import { MockServiceRepository } from "../../mocks/repositories";
import { ServiceType, ServicePrices } from "../../../src/domain/entities/Service";

describe("CalculateServicePriceUseCase", () => {
  let calculateServicePriceUseCase: CalculateServicePriceUseCase;
  let mockServiceRepository: MockServiceRepository;

  beforeEach(() => {
    mockServiceRepository = new MockServiceRepository();
    calculateServicePriceUseCase = new CalculateServicePriceUseCase(mockServiceRepository);
  });

  it("deve retornar 0 quando nenhum serviço for solicitado", async () => {
    // Preparação
    const serviceIds: string[] = [];

    // Ação
    const result = await calculateServicePriceUseCase.execute(serviceIds);

    // Verificação
    expect(result).toBe(0);
  });

  it("deve calcular o preço do corte de cabelo corretamente usando o campo type", async () => {
    // Preparação
    const serviceIds = ["service-1"]; // Corte de Cabelo

    // Configure o mock para usar o campo type
    jest.spyOn(mockServiceRepository, "findByIds").mockResolvedValue([
      {
        id: "service-1",
        name: "Corte de Cabelo",
        description: "Corte tradicional",
        price: 45,
        duration: 30,
        type: ServiceType.HAIRCUT,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Ação
    const result = await calculateServicePriceUseCase.execute(serviceIds);

    // Verificação
    expect(result).toBe(ServicePrices[ServiceType.HAIRCUT]);
  });

  it("deve calcular o preço da barba corretamente usando o campo type", async () => {
    // Preparação
    const serviceIds = ["service-2"]; // Barba

    // Configure o mock para usar o campo type
    jest.spyOn(mockServiceRepository, "findByIds").mockResolvedValue([
      {
        id: "service-2",
        name: "Barba",
        description: "Modelagem de barba",
        price: 50,
        duration: 20,
        type: ServiceType.BEARD,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Ação
    const result = await calculateServicePriceUseCase.execute(serviceIds);

    // Verificação
    expect(result).toBe(ServicePrices[ServiceType.BEARD]);
  });

  it("deve aplicar o preço de combo quando corte e barba forem solicitados usando o campo type", async () => {
    // Preparação
    const serviceIds = ["service-1", "service-2"]; // Corte e Barba

    // Configure o mock para usar o campo type
    jest.spyOn(mockServiceRepository, "findByIds").mockResolvedValue([
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
      }
    ]);

    // Ação
    const result = await calculateServicePriceUseCase.execute(serviceIds);

    // Verificação
    expect(result).toBe(ServicePrices[ServiceType.COMBO]);
    // Verifica que o combo é menor que a soma dos preços individuais
    expect(result).toBeLessThan(ServicePrices[ServiceType.HAIRCUT] + ServicePrices[ServiceType.BEARD]);
  });

  it("deve usar o preço direto do combo quando um serviço do tipo COMBO for solicitado", async () => {
    // Preparação
    const serviceIds = ["service-combo"]; // Serviço de Combo

    // Configure o mock para usar um serviço do tipo COMBO
    jest.spyOn(mockServiceRepository, "findByIds").mockResolvedValue([
      {
        id: "service-combo",
        name: "Combo Corte + Barba",
        description: "Combo promocional",
        price: 75,
        duration: 50,
        type: ServiceType.COMBO,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Ação
    const result = await calculateServicePriceUseCase.execute(serviceIds);

    // Verificação
    expect(result).toBe(ServicePrices[ServiceType.COMBO]);
  });

  it("deve calcular o preço total para serviços do tipo OTHER", async () => {
    // Preparação
    const serviceIds = ["service-3", "service-4"]; // Serviços não padronizados

    // Configure o mock para serviços personalizados
    jest.spyOn(mockServiceRepository, "findByIds").mockResolvedValue([
      {
        id: "service-3",
        name: "Hidratação",
        description: "Tratamento capilar",
        price: 60,
        duration: 40,
        type: ServiceType.OTHER,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "service-4",
        name: "Coloração",
        description: "Tintura de cabelo",
        price: 80,
        duration: 60,
        type: ServiceType.OTHER,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Ação
    const result = await calculateServicePriceUseCase.execute(serviceIds);

    // Verificação
    expect(result).toBe(140); // 60 + 80
  });

  it("deve detectar tipos de serviço através do nome quando o campo type não estiver presente", async () => {
    // Preparação
    const serviceIds = ["service-1", "service-2"]; // Corte e Barba

    // Configure o mock sem o campo type, usando apenas os nomes
    jest.spyOn(mockServiceRepository, "findByIds").mockResolvedValue([
      {
        id: "service-1",
        name: "Corte de Cabelo",
        description: "Corte tradicional",
        price: 45,
        duration: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "service-2",
        name: "Barba",
        description: "Modelagem de barba",
        price: 50,
        duration: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Ação
    const result = await calculateServicePriceUseCase.execute(serviceIds);

    // Verificação
    expect(result).toBe(ServicePrices[ServiceType.COMBO]);
  });
}); 