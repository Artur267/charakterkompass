# Multi-stage Build für Cloud Run
# Stage 1: Build mit Node
FROM node:20-alpine AS builder

WORKDIR /app

# Dependencies installieren
COPY package*.json ./
RUN npm ci

# Source code kopieren und bauen
COPY . .
RUN npm run build

# Stage 2: Production mit nginx
FROM nginx:alpine

# Nginx Config kopieren (separate Datei!)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Build-Artefakte von Stage 1 kopieren
COPY --from=builder /app/dist /usr/share/nginx/html

# Cloud Run läuft auf Port 8080
EXPOSE 8080

# Nginx im Foreground starten
CMD ["nginx", "-g", "daemon off;"]
