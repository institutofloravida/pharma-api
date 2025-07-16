FROM node:20-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do projeto
COPY . .

# Gera Prisma Client
RUN npx prisma generate

# Compila o projeto NestJS (gera a pasta dist)
RUN npm run build

# Etapa 2: Produção
FROM node:20-alpine

WORKDIR /app

# Copia apenas o necessário para produção
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# (Opcional) Copiar .env se necessário
# COPY .env .env

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/src/infra/main"]