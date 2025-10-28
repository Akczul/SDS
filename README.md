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
- `GET /anuncios?categoria=Tecnologia`
- `POST /anuncios` (admin) {titulo, contenido, categoria}
- `PATCH /anuncios/:id` (admin)
- `DELETE /anuncios/:id` (admin)
- `GET /suscripciones` (user)
- `POST /suscripciones` {categoria}
- `DELETE /suscripciones` {categoria}

> Nota: `synchronize: true` solo para desarrollo.
