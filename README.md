# VortexStreaming Frontend

Frontend web para plataforma de streaming de videos **VortexStreaming**.

La aplicación permite consumir contenido multimedia desde el backend **VortexVideo API**, proporcionando una interfaz para visualizar videos, buscar contenido y gestionar preferencias del usuario.

---

# Arquitectura

La solución está basada en una arquitectura cliente-servidor:

```text
                 Usuario
                    |
                    v

          VortexStreaming Frontend
                    |
                    |
                    v

           VortexVideo Backend API
                    |
          +---------+---------+
          |                   |
          v                   v

        MySQL          Filesystem
      Metadata          Videos
```

---

# Comunicación Frontend - Backend

El frontend se comunica con el backend mediante APIs REST.

Flujo:

```text
Angular Frontend
   |
   v
VortexVideo Backend API
   |
   v
Base de datos + Archivos multimedia
```

El frontend no almacena videos, únicamente consume la información proporcionada por la API.

---

# Ubicación del proyecto

```
C:\Users\AlejandroAgRa\Documents\GitHub\streaming-app\VortexStreaming-app
```

---

# Tecnologías principales

- Angular
- TypeScript
- HTML5
- CSS
- NPM

---

# Ejecución local

## Instalar dependencias

Desde la raíz del proyecto:

```bash
npm install
```

---

## Ejecutar aplicación

```bash
ng serve
```

La aplicación estará disponible en:

```
http://localhost:4200/vortex-streaming
```

---

# Ejecución mediante Docker

## Construcción de imagen

```bash
docker build -t vortex-streaming:1.0 .
```

---

## Ejecutar contenedor

```bash
docker run -d --name vortex-front -p 4200:80 -e BACKEND_HOST=host.docker.internal vortex-streaming:1.0
```

---

# Acceso a la aplicación

Abrir en navegador:

```
http://localhost:4200/vortex-streaming
```

---

# Funcionalidades principales

## Reproducción de videos

Permite:

- Visualizar contenido multimedia.
- Reproducir videos.
- Navegar entre diferentes contenidos.

---

## Reanudar reproducción

La aplicación permite continuar un video desde el punto donde el usuario dejó la reproducción.

Esto mejora la experiencia de consumo de contenido multimedia.

---

## Búsqueda

Permite buscar contenido por:

- Nombre del video.
- Artista.

---

## Likes

Los usuarios pueden marcar videos mediante la opción:

❤️ Like

Esto permite gestionar preferencias sobre el contenido.

---

# Integración con Backend

El frontend requiere que el backend **VortexVideo API** esté disponible.

Backend:

```
http://localhost:8080
```

Variable de configuración unicamente usado para DOCKER ,con kubernetes en la escribiriamos en los deployments del frontend algo asi:

        env:
        - name: BACKEND_HOST
          value: vortex-backend-service


```
BACKEND_HOST
```

Ejemplo usando Docker:

```bash
-e BACKEND_HOST=host.docker.internal
```

---

# Proyecto

**VortexStreaming Frontend**

Aplicación Angular para consumo de contenido multimedia mediante la plataforma VortexVideo.