# Dockerfile para versão estática
FROM nginx:alpine

# Copiar arquivos estáticos para o nginx
COPY index.html /usr/share/nginx/html/
COPY src/ /usr/share/nginx/html/src/
COPY frontend/public/images/ /usr/share/nginx/html/images/

# Configuração customizada do nginx para SPA
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Configuração para arquivos estáticos
    location / {
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # Cache para imagens e assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Configuração de CORS para Firebase
    location ~* \.(js|css)$ {
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
        add_header Access-Control-Allow-Headers "Origin, Content-Type, Accept";
    }
}
EOF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]