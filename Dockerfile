# ===============================
# Etapa 1 - Build Angular
# ===============================
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# ===============================
# Etapa 2 - Nginx
# ===============================
FROM nginx:1.29-alpine

COPY --from=builder /app/dist/vortex-streaming-app/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s \
            --timeout=3s \
            --start-period=10s \
            --retries=3 \
CMD wget --spider -q http://localhost/ || exit 1