# Docker Setup para OrbStack

Este documento fornece instruções para executar o projeto no OrbStack usando Docker.

## Pré-requisitos

- [OrbStack](https://orbstack.dev/) instalado
- Docker Compose v2+

## Arquivos Docker

- **`frontend/Dockerfile`** - Build de produção React com nginx multi-stage
- **`frontend/Dockerfile.dev`** - Versão React para desenvolvimento com hot reload
- **`docker-compose.yml`** - Orquestração da aplicação React
- **`.dockerignore`** - Otimização do contexto de build

## Comandos Rápidos

### Executar Aplicação (Produção)
```bash
docker-compose up -d
```

**Acessar:**
- Aplicação React: http://localhost:3000

### Modo Desenvolvimento (React com Hot Reload)
```bash
docker-compose --profile dev up -d
```

**Acessar:**
- React dev server: http://localhost:5173

### Parar Containers
```bash
docker-compose down
```

### Ver Status dos Containers
```bash
docker-compose ps
```

### Ver Logs
```bash
# Todos os containers
docker-compose logs -f

# Container específico
docker-compose logs -f static-app
docker-compose logs -f react-app
```

## Builds Individuais

### Versão Produção
```bash
cd frontend/
docker build -t es-terrenos .
docker run -p 3000:80 es-terrenos
```

### Versão Desenvolvimento
```bash
cd frontend/
docker build -f Dockerfile.dev -t es-terrenos-dev .
docker run -p 5173:5173 -v $(pwd)/src:/app/src es-terrenos-dev
```

## Estrutura dos Containers

### Container Produção (es-terrenos)
- **Base:** Multi-stage (node:18-alpine + nginx:alpine)
- **Porta:** 3000 → 80
- **Build:** Vite build otimizado com React
- **Configuração:** nginx otimizado para React SPA com CORS para Firebase

### Container Desenvolvimento (es-terrenos-dev)
- **Base:** node:18-alpine
- **Porta:** 5173 → 5173
- **Recursos:** Hot reload, volumes para desenvolvimento
- **Comando:** `npm run dev --host 0.0.0.0`

## Configurações do Nginx

### Headers de Cache
- **Arquivos estáticos** (js, css, imagens): 1 ano de cache
- **HTML**: No-cache para sempre servir a versão mais recente

### CORS
- Habilitado para integração com Firebase
- Headers apropriados para assets JavaScript

### SPA Fallback
- `try_files $uri $uri/ /index.html` para roteamento client-side

## Troubleshooting

### Build Falha por Falta de Imagens
Se você receber erro sobre pasta `images/` não encontrada:
```bash
# Verifique se as imagens estão em frontend/public/images/
ls frontend/public/images/
```

### Erro no Script copy-assets.cjs
Certifique-se de que o arquivo existe:
```bash
ls frontend/scripts/copy-assets.cjs
```

### Porta em Uso
Se as portas 3000, 3001 ou 5173 estiverem em uso:
```bash
# Verificar processos usando as portas
lsof -i :3000
lsof -i :3001
lsof -i :5173

# Ou editar docker-compose.yml para usar outras portas
```

### Limpar Cache do Docker
```bash
# Remover imagens não utilizadas
docker system prune -a

# Rebuild forçado
docker-compose build --no-cache
```

## Performance

### Tamanhos das Imagens
- **Static:** ~15MB (nginx + arquivos estáticos)
- **React:** ~20MB (nginx + build otimizado)
- **React Dev:** ~150MB (node + todas as dependências)

### Otimizações Aplicadas
- Multi-stage builds para reduzir tamanho final
- .dockerignore para contexto menor
- nginx configurado para cache agressivo de assets
- Compressão gzip habilitada

## Integração com OrbStack

O OrbStack oferece algumas vantagens específicas:
- Interface gráfica para gerenciar containers
- Integração nativa com macOS
- Melhor performance que Docker Desktop
- Menos uso de recursos

Para melhor experiência no OrbStack:
1. Use a interface gráfica para monitorar containers
2. Configure limits de recursos se necessário
3. Use volumes nomeados para dados persistentes (se aplicável)