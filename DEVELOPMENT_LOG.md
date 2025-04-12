# Log de Desenvolvimento do Microserviço Barber Shop

Este documento registra o histórico de desenvolvimento do projeto, detalhando as principais alterações, decisões de arquitetura e implementações.

## Estrutura do Projeto

O projeto segue a arquitetura Clean Architecture com separação clara entre domínio, casos de uso e infraestrutura:

```
backend/
├── prisma/             # Configuração do ORM Prisma e schema do banco de dados
├── src/
│   ├── config/         # Configurações da aplicação
│   ├── domain/         # Regras de negócio e entidades
│   │   ├── entities/   # Definição das entidades do sistema
│   │   ├── repositories/ # Interfaces dos repositórios
│   │   └── usecases/   # Implementação dos casos de uso
│   ├── infra/          # Implementações de infraestrutura
│   │   ├── database/   # Conexão com o banco de dados e repositórios
│   │   └── http/       # Controllers, rotas e middleware HTTP
│   ├── utils/          # Funções utilitárias
│   └── index.ts        # Ponto de entrada da aplicação
└── tests/              # Testes automatizados
```

## Histórico de Desenvolvimento

### Commit: d506423

**Descrição**: Refatoração da entidade Barber, repositórios e testes.

**Alterações**:
- Atualização da entidade Barber para incluir funcionalidades adicionais
- Atualização dos repositórios para manipulação de barbeiros
- Implementação de testes para validar as mudanças

### Commit: 9cd42c4

**Descrição**: Adição do controller e rotas para gerenciamento de barbeiros com documentação Swagger.

**Alterações**:

1. **Criação do BarberController**:
   - Implementação dos métodos CRUD:
     - `findAll`: Lista todos os barbeiros
     - `findById`: Busca um barbeiro pelo ID
     - `findByUserId`: Busca um barbeiro pelo ID do usuário associado
     - `create`: Cria um novo barbeiro
     - `update`: Atualiza os dados de um barbeiro existente
     - `delete`: Remove um barbeiro do sistema
   - Tratamento adequado de erros em todas as operações
   - Validações para garantir a integridade dos dados

2. **Criação das rotas para barbeiros**:
   - Adição do arquivo `barberRoutes.ts` para definir as rotas REST:
     - GET `/api/barbers`: Lista todos os barbeiros
     - GET `/api/barbers/:id`: Obtém um barbeiro por ID
     - GET `/api/barbers/user/:userId`: Obtém um barbeiro pelo ID do usuário
     - POST `/api/barbers`: Cria um novo barbeiro
     - PUT `/api/barbers/:id`: Atualiza um barbeiro existente
     - DELETE `/api/barbers/:id`: Remove um barbeiro

3. **Documentação Swagger**:
   - Criação do arquivo `barberSwagger.ts` com a documentação detalhada das APIs
   - Documentação das entidades e endpoints no padrão OpenAPI

4. **Configuração das rotas**:
   - Atualização do arquivo `routes/index.ts` para incluir as rotas de barbeiros
   - Configuração da ordem das rotas para evitar conflitos, garantindo que a rota específica `/user/:userId` seja processada antes da rota genérica `/:id`

5. **Atualização dos controladores**:
   - Adição do BarberController ao arquivo `controllers/index.ts`

## Regras de Negócio Implementadas

### Barbeiros (Barbers)
- Um usuário só pode estar associado a um barbeiro
- Cada barbeiro pode ter uma especialidade opcional
- Barbeiros podem indicar se são especialistas em determinados tipos de serviços

### Clientes (Customers)
- Não realiza corte para crianças menores de 3 anos
- Não atende clientes com alergia de pele

### Agendamentos (Scheduling)
- Não permite agendar um novo horário se já existir um agendamento confirmado para o mesmo horário
- Bloqueia agendamentos em datas que coincidam com feriados
- Permite agendamento apenas com, no mínimo, uma semana de antecedência ou em casos de desistência

### Serviços (Services)
- Preços diferenciados conforme o tipo:
  - Corte + Barba: R$75,00
  - Apenas Corte: R$45,00
  - Apenas Barba: R$50,00

## Próximos Passos

1. Implementação da autenticação e autorização com JWT
2. Criação dos endpoints para geração de relatórios
3. Testes de integração para os controllers
4. Implementação do frontend da aplicação
5. Criação de Docker Compose para ambiente de desenvolvimento

## Referências

- [Documentação do Prisma](https://www.prisma.io/docs/)
- [Documentação do Express](https://expressjs.com/)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) 