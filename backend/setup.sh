#!/bin/bash

# Instalar dependências
npm install

# Criar diretório de logs
mkdir -p logs

# Iniciar banco de dados
docker-compose up -d

# Gerar cliente Prisma e executar migrações
npx prisma generate
npx prisma migrate dev --name init

echo "Setup concluído!" 