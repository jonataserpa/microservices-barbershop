// Configuração para os testes de integração
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Cria uma nova instância do cliente Prisma para testes
export const prismaTest = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL,
    },
  },
});

// Função para limpar o banco de dados antes de cada teste
export async function clearDatabase() {
  // A ordem importa por causa das relações/constraints
  await prismaTest.scheduleService.deleteMany({});
  await prismaTest.schedule.deleteMany({});
  await prismaTest.service.deleteMany({});
  await prismaTest.customer.deleteMany({});
  await prismaTest.barber.deleteMany({});
  await prismaTest.user.deleteMany({});
}

// Configuração global de timeout
jest.setTimeout(10000);

// Executado uma vez antes de todos os testes
beforeAll(async () => {
  // Conecta ao banco de dados de teste
  await prismaTest.$connect();
});

// Executado uma vez depois de todos os testes
afterAll(async () => {
  // Limpa o banco de dados e fecha a conexão
  await clearDatabase();
  await prismaTest.$disconnect();
}); 