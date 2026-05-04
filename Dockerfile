# Multi-stage Build für optimales Cloud Run Deployment
# Stage 1: Build mit Node
FROM node:20-alpine AS builder

WORKDIR /app

# Dependencies installieren (cached wenn package.json unverändert)
COPY package*.json ./
RUN npm ci --only=production=false

# Source code kopieren und bauen
COPY . .
RUN npm run build

# Stage 2: Production mit nginx
FROM nginx:alpine

# Nginx Config für SPA (alle Routen → index.html)
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 8080;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # Gzip für bessere Performance
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Cache-Control für static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA Fallback: Alle Routen → index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Health check für Cloud Run
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Build-Artefakte von Stage 1 kopieren
COPY --from=builder /app/dist /usr/share/nginx/html

# Cloud Run läuft auf Port 8080 (nicht 80!)
EXPOSE 8080

# Nginx im Foreground starten (wichtig für Cloud Run!)
CMD ["nginx", "-g", "daemon off;"]
