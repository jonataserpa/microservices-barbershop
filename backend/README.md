# Microserviço Barber Shop - Backend

API para gestão de agendamentos, serviços e clientes de uma barbearia.

## Tecnologias Utilizadas

- Bun.js
- TypeScript
- Express
- Prisma (PostgreSQL)
- Jest

## Regras de Negócio

### Agendamentos (Scheduling)
- Não permite agendar um novo horário se já existir um agendamento com status **confirmado** para o mesmo horário.
- Bloqueia agendamentos em datas que coincidam com feriados do ano.
- Permite agendamento apenas com, no mínimo, uma semana de antecedência ou em casos de desistência.
- Pagamento somente online. Se o agendamento for confirmado e o cliente não comparecer, não haverá reembolso.

### Serviços (Services)
- Preços diferenciados conforme o tipo de serviço/combo:
  - **Corte + Barba:** R$75,00
  - **Apenas Corte:** R$45,00
  - **Apenas Barba:** R$50,00
- Se ambos os serviços forem escolhidos, aplica o valor do combo (R$75,00).

### Clientes (Customers)
- Não realiza corte para crianças menores de 3 anos.
- Não atende clientes com alergia de pele (informação identificada no cadastro).

### Relatórios (Reports)
- Agrega os totais dos agendamentos do dia (por status).
- Total de clientes cadastrados.
- Faturamento mensal.

## Estrutura do Projeto

### Arquitetura

O projeto segue os princípios de Clean Architecture e Domain-Driven Design (DDD), com as seguintes camadas:

- **Domain**: Contém as entidades, casos de uso e interfaces de repositórios.
- **Infra**: Implementação das interfaces definidas no domínio.
  - **Database**: Conexão com o banco de dados e implementação dos repositórios.
  - **HTTP**: Controllers e rotas.
- **Utils**: Utilitários e funções auxiliares.

### Camada de Domínio

- **Entities**: Definição das entidades do sistema (User, Customer, Barber, Service, Schedule, etc.).
- **Repositories (interfaces)**: Contratos para acesso aos dados.
- **Use Cases**: Implementação dos casos de uso da aplicação.

### Camada de Infraestrutura

- **Database**:
  - **Prisma**: ORM para acesso ao banco de dados PostgreSQL.
  - **Repositories**: Implementação das interfaces de repositório do domínio.
- **HTTP**:
  - **Controllers**: Gerenciamento das requisições HTTP.
  - **Routes**: Definição das rotas da API.

## Endpoints

### Agendamentos

- `POST /api/scheduling`: Cria um novo agendamento.
- `GET /api/scheduling`: Lista todos os agendamentos.
- `GET /api/scheduling/:id`: Obtém um agendamento específico.
- `PUT /api/scheduling/:id`: Atualiza um agendamento.
- `DELETE /api/scheduling/:id`: Remove um agendamento.
- `GET /api/scheduling/customer/:customerId`: Lista agendamentos por cliente.
- `GET /api/scheduling/barber/:barberId`: Lista agendamentos por barbeiro.
- `GET /api/scheduling/date`: Lista agendamentos por data.

## Como Executar

### Requisitos

- Bun.js
- PostgreSQL

### Configuração

1. Clone o repositório
2. Instale as dependências:
   ```bash
   bun install
   ```
3. Configure as variáveis de ambiente (crie um arquivo .env baseado no .env.example)
4. Execute as migrações do banco de dados:
   ```bash
   bun prisma:migrate
   ```
5. Gere o client do Prisma:
   ```bash
   bun prisma:generate
   ```

### Desenvolvimento

```bash
bun dev
```

### Produção

```bash
bun build
bun start
```

## Testes

```bash
bun test
```

## Logs

Os logs são armazenados em:
- `logs/error.log` - Apenas erros
- `logs/combined.log` - Todos os logs

## Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.

## Documentação da API

A API é documentada utilizando o Swagger. Para acessar a documentação, inicie o servidor e acesse:

```
http://localhost:3333/api-docs
```

Na documentação, você encontrará:

- Todos os endpoints disponíveis
- Modelos de dados utilizados
- Parâmetros necessários para cada requisição
- Exemplos de requisições e respostas
- Status codes retornados

A documentação permite também testar os endpoints diretamente pela interface do Swagger. 