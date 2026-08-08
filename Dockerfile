# ===============================
# Etapa 1 - Build Angular
# ===============================
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build -- --configuration production

# ===============================
# Etapa 2 - Nginx
# ===============================
FROM nginx:1.29-alpine


COPY --from=builder /app/dist/vortex-streaming-app/browser /usr/share/nginx/html


RUN rm /etc/nginx/conf.d/default.conf


COPY nginx/nginx.conf /etc/nginx/templates/default.conf.template


EXPOSE 80