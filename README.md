# 🏢 CoSpace — Plataforma Fullstack de Reservas de Coworking

CoSpace es una plataforma moderna de reserva de espacios de trabajo colaborativo por horas (hot desks, cabinas acústicas privadas y salas de juntas ejecutivas). Desarrollada con **Next.js 16 (App Router)**, **React 19**, **TypeScript estricto (0% any)**, **Prisma ORM**, base de datos PostgreSQL alojada en **Supabase** y desplegada en **Vercel**.

---

## 🌐 Enlaces de Despliegue y Acceso

* **URL en Producción (Vercel):** [INSERTAR_TU_URL_DE_VERCEL_AQUÍ]
* **Repositorio GitHub:** [INSERTAR_TU_URL_DE_GITHUB_AQUÍ]
* **Base de Datos:** PostgreSQL en Supabase (AWS us-east-1) con PgBouncer Pooler

---

## 👤 Credenciales de Prueba

| Rol | Correo Electrónico | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@cospace.com` | `Admin1234*` | CRUD total de espacios, activación/desactivación, reportes |
| **Usuario Regular** | `juan@cospace.com` | `User1234*` | Explorar catálogo, reservar espacios, cancelar reservas |

---

## 🛠️ Stack Tecnológico

* **Frontend:** Next.js 16.4.3 (App Router), React 19, Tailwind CSS v4, GSAP (animaciones React Bits).
* **Backend:** Next.js Route Handlers (REST API), TypeScript con verificación estricta.
* **Base de Datos & ORM:** PostgreSQL en Supabase, Prisma ORM 6.19.3.
* **Autenticación & Seguridad:** JWT Access (15m) y Refresh (7d) en cookies HttpOnly seguras con firma `jose` y hashing SHA-256 en BD. Rate limiting contra ataques de fuerza bruta.
* **Protección de Rutas:** Middleware de Next.js 16 (`src/proxy.ts`).
* **Internacionalización (i18n):** Contexto nativo con soporte Español (ES) e Inglés (EN).
* **DevOps:** Contenedor Docker multi-stage optimizado (`Dockerfile` y `docker-compose.yml`).

---

## 📋 Cumplimiento de las 14 Reglas de Negocio

1. **Duración de reserva:** Entre 1 y 4 horas como máximo.
2. **Intervalos exactos:** Solo se permiten horas completas (ej: 09:00 a 11:00; minutos como :15 o :30 son rechazados).
3. **Horario de operación:** Exclusivamente de 07:00 a 21:00.
4. **Anticipación máxima:** Reservas permitidas hasta con 30 días de anticipación.
5. **Sin solapamiento en espacio:** No se puede reservar un espacio si ya está ocupado en ese horario (`409 Conflict`).
6. **Sin solapamiento de usuario:** Un usuario no puede tener dos reservas simultáneas en diferentes espacios (`409 Conflict`).
7. **Límite de reservas activas:** Máximo 3 reservas futuras confirmadas simultáneas por usuario.
8. **Cálculo de precio en servidor:** El precio total se calcula estrictamente en el backend (`hourlyPrice * horas`).
9. **Anticipación de cancelación:** Cancelación permitida únicamente con al menos 2 horas de anticipación al inicio.
10. **Cancelación lógica:** Las reservas se marcan como `CANCELLED`; nunca se borran físicamente de la base de datos.
11. **Privacidad de reservas:** Los usuarios regulares solo pueden ver y cancelar sus propias reservas.
12. **Gestión de espacios:** El Administrador cuenta con un CRUD completo para crear, editar y cambiar estado de los espacios.
13. **Protección de espacios con reservas:** No se puede desactivar un espacio si tiene reservas futuras confirmadas (`409 Conflict`).
14. **Protección contra fuerza bruta (Rate Limit):** Bloqueo temporal por cuenta/IP tras 5 intentos fallidos consecutivos de inicio de sesión.

---

## 🚀 Ejecución en Local

### 1. Clonar e instalar dependencias
```bash
git clone https://github.com/TU_USUARIO/cospace.git
cd cospace
npm install