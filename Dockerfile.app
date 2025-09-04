# Dockerfile.app

# 1) Etapa de build: instala deps y construye Astro (SSR)
FROM node:20-alpine AS build
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar el resto del código
COPY . .

# Construir para SSR (usa tu adapter @astrojs/node)
RUN npm run build

# 2) Runtime minimalista
FROM node:20-alpine
WORKDIR /app

# Copiamos solo lo necesario para ejecutar
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# Punto de entrada del servidor Astro (SSR)
CMD ["node", "./dist/server/entry.mjs"]
