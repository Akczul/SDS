# Sistema de Anuncios y Suscripciones (NestJS)

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
