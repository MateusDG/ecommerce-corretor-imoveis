# Multi-stage build para otimizar o tamanho da imagem
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files e scripts necessários
COPY package*.json ./
COPY scripts/ ./scripts/

# Instalar dependências (incluindo dev para build)
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Estágio de produção com nginx
FROM nginx:alpine

# Copiar build da aplicação
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuração customizada do nginx para React SPA
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Configuração para SPA React
    location / {
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # Cache para assets estáticos
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Configuração de CORS
    location ~* \.(js|css|map)$ {
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
        add_header Access-Control-Allow-Headers "Origin, Content-Type, Accept";
    }

    # Configuração para arquivos de fonte
    location ~* \.(woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }
}
EOF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]