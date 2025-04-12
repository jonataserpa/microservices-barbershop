# Testes de Integração do Barber Shop

Este diretório contém os testes de integração para validar os casos de uso e as regras de negócio da aplicação Barber Shop.

## Estrutura

- `mocks/`: Contém os mocks dos repositórios e entidades para os testes
- `integration/`: Contém os testes de integração
  - `usecases/`: Testes dos casos de uso
- `setup.ts`: Configuração global para os testes

## Casos de Uso Testados

### CreateScheduleUseCase
Testa o caso de uso para criação de agendamentos, verificando as seguintes regras:
- Não permitir agendar em feriados
- Não permitir agendar com menos de uma semana de antecedência
- Não permitir conflito de horários
- Não atender clientes com alergia de pele
- Não realizar corte para crianças menores de 3 anos

### CalculateServicePriceUseCase
Testa o caso de uso para cálculo de preços dos serviços, verificando:
- Cálculo correto para corte de cabelo
- Cálculo correto para barba
- Aplicação de desconto para o combo (corte + barba)
- Cálculo para serviços não padronizados

## Execução dos Testes

Para executar os testes:

```bash
npm test
```

Para executar os testes com watch mode:

```bash
npm run test:watch
```

Para gerar relatório de cobertura:

```bash
npm run test:coverage
``` 