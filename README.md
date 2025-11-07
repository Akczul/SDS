# Sistema de Anuncios y Suscripciones por Categoría

Sistema completo de gestión de anuncios donde los administradores publican avisos por categorías y los usuarios se suscriben para recibir notificaciones por correo electrónico.

## 🚀 Características

- ✅ **Autenticación JWT**: Registro e inicio de sesión seguro
- ✅ **Gestión de Roles**: Usuarios y Administradores
- ✅ **CRUD de Anuncios**: Crear, leer, actualizar y eliminar anuncios
- ✅ **Sistema de Categorías**: Organización por categorías
- ✅ **Suscripciones**: Los usuarios se suscriben a categorías de interés
- ✅ **Notificaciones por Email**: Nodemailer con plantillas HTML
- ✅ **Validaciones Robustas**: class-validator en todos los DTOs
- ✅ **Documentación API**: Swagger/OpenAPI
- ✅ **Seguridad**: bcrypt, JWT Guards, Rate Limiting
- ✅ **Mensajes de Error Descriptivos**: Respuestas claras y útiles

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- MySQL (v5.7 o superior)
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd SDS
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=tu_password
DB_NAME=sistema_anuncios

JWT_SECRET=cambia-este-secreto-por-uno-seguro
JWT_EXPIRES=3600s

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=tu_correo@gmail.com
MAIL_PASS=tu_clave_app

APP_URL=http://localhost:3000
```

4. **Crear la base de datos**
```sql
CREATE DATABASE sistema_anuncios CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. **Ejecutar la aplicación**
```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start
```

La aplicación estará disponible en `http://localhost:3000`  
Documentación Swagger en `http://localhost:3000/docs`

## 📚 Estructura del Proyecto

```
src/
├── anuncios/          # Módulo de anuncios
├── auth/              # Autenticación y autorización
├── categorias/        # Módulo de categorías
├── common/            # Guards y decoradores compartidos
├── health/            # Health check endpoint
├── mail/              # Servicio de correo electrónico
├── suscripciones/     # Módulo de suscripciones
├── users/             # Módulo de usuarios
├── app.module.ts      # Módulo principal
└── main.ts            # Punto de entrada
```

## 🔑 Endpoints Principales

### Autenticación
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/perfil` - Obtener perfil del usuario autenticado 🔒

### Categorías
- `GET /categorias` - Listar todas las categorías
- `GET /categorias/:id` - Obtener una categoría
- `POST /categorias` - Crear categoría 🔒👑
- `PATCH /categorias/:id` - Actualizar categoría 🔒👑
- `DELETE /categorias/:id` - Eliminar categoría 🔒👑

### Anuncios
- `GET /anuncios` - Listar anuncios con paginación
- `GET /anuncios/:id` - Obtener un anuncio
- `GET /anuncios/mis-anuncios` - Anuncios de categorías suscritas 🔒
- `POST /anuncios` - Crear anuncio 🔒👑
- `PATCH /anuncios/:id` - Actualizar anuncio 🔒👑
- `DELETE /anuncios/:id` - Eliminar anuncio 🔒👑

### Suscripciones
- `GET /suscripciones` - Mis suscripciones 🔒
- `POST /suscripciones` - Suscribirse a categoría 🔒
- `DELETE /suscripciones` - Desuscribirse de categoría 🔒

### Usuarios
- `GET /users/:id` - Obtener usuario 🔒👑
- `PATCH /users/:id` - Actualizar usuario 🔒👑

🔒 = Requiere autenticación  
👑 = Requiere rol de administrador

## 📧 Notificaciones por Correo

El sistema envía correos electrónicos en dos situaciones:

1. **Nuevo Anuncio**: Cuando un administrador crea un anuncio, todos los usuarios suscritos a esa categoría reciben un correo
2. **Confirmación de Suscripción**: Al suscribirse o desuscribirse, el usuario recibe un correo con sus preferencias actualizadas

### Configurar Gmail para Nodemailer

1. Habilita la verificación en dos pasos en tu cuenta de Google
2. Genera una contraseña de aplicación en: https://myaccount.google.com/apppasswords
3. Usa esa contraseña en `MAIL_PASS` del archivo `.env`

## 🧪 Pruebas

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## 🔐 Seguridad Implementada

- **Contraseñas**: Hasheadas con bcrypt (10 rounds)
- **JWT**: Tokens firmados con secreto fuerte
- **Rate Limiting**: Máximo 5 peticiones cada 10 segundos
- **Validaciones**: class-validator en todos los DTOs
- **Usuario Activo**: Verificación antes de emitir tokens
- **Guards**: JwtAuthGuard y RolesGuard protegen rutas sensibles

## 📝 Validaciones de Registro

- **Nombre/Apellido**: 2-50 caracteres
- **Nombre de Usuario**: 3-20 caracteres (solo letras, números, guion bajo y punto)
- **Email**: Formato válido y único
- **Contraseña**: Mínimo 8 caracteres, debe incluir:
  - Al menos una mayúscula
  - Al menos un número
  - Al menos un símbolo
- **Rol**: 'user' o 'admin'

## 🗃️ Relaciones de Base de Datos

- **User → Suscripcion**: One-to-Many (Un usuario puede tener muchas suscripciones)
- **Categoria → Suscripcion**: One-to-Many (Una categoría puede tener muchas suscripciones)
- **Categoria → Anuncio**: One-to-Many (Una categoría puede tener muchos anuncios)
- **User ↔ Categoria**: Many-to-Many a través de Suscripcion

## 🎯 Características de Calidad

### Mensajes Descriptivos
Todas las respuestas incluyen mensajes claros:
```json
{
  "items": [],
  "total": 0,
  "message": "No hay anuncios en tus categorías suscritas"
}
```

### Manejo de Errores
- Try-catch en todos los servicios
- Logging con Winston
- Mensajes de error específicos y útiles

### Validaciones Completas
- DTOs validados con class-validator
- Validación de unicidad (email, nombreUsuario, nombre de categoría)
- Validación de existencia antes de operaciones
- ParseIntPipe en parámetros de ID

## 👥 Roles y Permisos

### Usuario (user)
- Ver categorías y anuncios
- Suscribirse/desuscribirse a categorías
- Ver sus propias suscripciones
- Ver anuncios de categorías suscritas

### Administrador (admin)
- Todo lo del usuario
- Crear, editar y eliminar categorías
- Crear, editar y eliminar anuncios
- Gestionar usuarios

## 🚦 Estados HTTP Usados

- `200 OK` - Operación exitosa
- `201 Created` - Recurso creado
- `400 Bad Request` - Validación fallida
- `401 Unauthorized` - No autenticado o credenciales inválidas
- `403 Forbidden` - No tiene permisos
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto (duplicado)
- `429 Too Many Requests` - Rate limit excedido
- `500 Internal Server Error` - Error del servidor

## 📖 Documentación API

Una vez iniciada la aplicación, visita:
- Swagger UI: http://localhost:3000/docs

## 🤝 Contribuciones

Este proyecto fue desarrollado como parte de un trabajo académico.

## 📄 Licencia

Este proyecto es privado y con fines educativos.

---
Desarrollado con ❤️ usando NestJS (NestJS)

## Requisitos
- Node 18+
- MySQL 8+

## Configuración
1. Copia `.env.example` a `.env` y coloca tus valores.
2. Instala dependencias: `npm install`
3. Ejecuta en desarrollo: `npm run start:dev`

## Endpoints rápidos
- `POST /auth/register` {nombre, apellido, nombreUsuario, email, password, role}
- `POST /auth/login` {identifier, password} -> `access_token`
- `GET /auth/perfil` (Bearer token)
- `GET /anuncios` lista paginada con filtros y orden:
	- Query: `?categoria=Tec&page=1&limit=10&sortBy=fechaPublicacion&sortDir=DESC`
- `GET /anuncios/:id`
- `GET /anuncios/mis` (user, Bearer) anuncios de tus categorías suscritas
- `POST /anuncios` (admin) {titulo, contenido, categoria}
- `PATCH /anuncios/:id` (admin)
- `DELETE /anuncios/:id` (admin)
- `GET /suscripciones` (user)
- `POST /suscripciones` {categoria}
- `DELETE /suscripciones` {categoria}
- `GET /health` estado de la app y DB
- `GET /docs` documentación Swagger

> Nota: `synchronize: true` solo para desarrollo.

## Seguridad y límites
- Rate limiting en `/auth/register` y `/auth/login`: 5 solicitudes cada 10 segundos por cliente.
- Validación de entrada con `class-validator` y `ValidationPipe` global (`whitelist`, `forbidNonWhitelisted`, `transform`).
- JWT requerido en rutas protegidas; verificación de usuario activo.

## Configuración por entorno (.env)
Se valida en arranque con `Joi`. Variables requeridas: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, `JWT_SECRET`, `JWT_EXPIRES`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_SECURE`, `MAIL_USER`, `MAIL_PASS`, `APP_URL`.
