# Guía de Pruebas - Sistema de Anuncios y Suscripciones

Esta guía proporciona ejemplos de peticiones para probar todas las funcionalidades del sistema.

## 📋 Requisitos Previos

1. Servidor corriendo en `http://localhost:3000`
2. Base de datos MySQL creada y conectada
3. Variables de entorno configuradas correctamente

## 🔧 Herramientas Recomendadas

- **Postman** o **Insomnia** para pruebas de API
- **Swagger UI**: http://localhost:3000/docs (incluido en el proyecto)

---

## 1️⃣ AUTENTICACIÓN

### 1.1 Registrar un Usuario Normal

**POST** `/auth/register`

```json
{
  "nombre": "María",
  "apellido": "González",
  "nombreUsuario": "mariag",
  "email": "maria@example.com",
  "password": "Password123!",
  "role": "user"
}
```

**Respuesta esperada (201):**
```json
{
  "id": 1,
  "email": "maria@example.com",
  "nombreUsuario": "mariag",
  "message": "Usuario registrado exitosamente"
}
```

### 1.2 Registrar un Administrador

**POST** `/auth/register`

```json
{
  "nombre": "Carlos",
  "apellido": "Admin",
  "nombreUsuario": "admin",
  "email": "admin@example.com",
  "password": "Admin123!",
  "role": "admin"
}
```

### 1.3 Iniciar Sesión

**POST** `/auth/login`

```json
{
  "identifier": "mariag",
  "password": "Password123!"
}
```

**Respuesta esperada (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "maria@example.com",
    "nombreUsuario": "mariag",
    "nombre": "María",
    "apellido": "González",
    "role": "user"
  },
  "message": "Inicio de sesión exitoso"
}
```

**⚠️ IMPORTANTE**: Guarda el `access_token` para usarlo en las siguientes peticiones.

### 1.4 Obtener Perfil del Usuario

**GET** `/auth/perfil`

Headers:
```
Authorization: Bearer {access_token}
```

**Respuesta esperada (200):**
```json
{
  "id": 1,
  "nombre": "María",
  "apellido": "González",
  "nombreUsuario": "mariag",
  "email": "maria@example.com",
  "role": "user",
  "activo": true,
  "createdAt": "2025-11-06T...",
  "updatedAt": "2025-11-06T...",
  "message": "Perfil obtenido correctamente"
}
```

---

## 2️⃣ CATEGORÍAS

### 2.1 Crear Categorías (requiere admin)

**POST** `/categorias`

Headers:
```
Authorization: Bearer {access_token_admin}
```

Body:
```json
{
  "nombre": "Tecnología",
  "descripcion": "Anuncios relacionados con tecnología"
}
```

**Crear varias categorías:**

```json
{"nombre": "Deportes", "descripcion": "Anuncios deportivos"}
```

```json
{"nombre": "Entretenimiento", "descripcion": "Eventos y entretenimiento"}
```

```json
{"nombre": "Empleo", "descripcion": "Ofertas de trabajo"}
```

### 2.2 Listar Todas las Categorías (público)

**GET** `/categorias`

**Respuesta esperada (200):**
```json
{
  "items": [
    {
      "id": 1,
      "nombre": "Tecnología",
      "descripcion": "Anuncios relacionados con tecnología",
      "createdAt": "2025-11-06T...",
      "updatedAt": "2025-11-06T..."
    },
    ...
  ],
  "total": 4,
  "message": "Se encontraron 4 categoría(s)"
}
```

### 2.3 Obtener una Categoría (público)

**GET** `/categorias/1`

### 2.4 Actualizar Categoría (requiere admin)

**PATCH** `/categorias/1`

Headers:
```
Authorization: Bearer {access_token_admin}
```

Body:
```json
{
  "descripcion": "Tecnología e innovación"
}
```

### 2.5 Eliminar Categoría (requiere admin)

**DELETE** `/categorias/5`

Headers:
```
Authorization: Bearer {access_token_admin}
```

---

## 3️⃣ SUSCRIPCIONES

### 3.1 Suscribirse a una Categoría

**POST** `/suscripciones`

Headers:
```
Authorization: Bearer {access_token_user}
```

Body:
```json
{
  "categoriaId": 1
}
```

**Respuesta esperada (201):**
```json
{
  "id": 1,
  "user": {...},
  "categoria": {
    "id": 1,
    "nombre": "Tecnología",
    "descripcion": "..."
  },
  "message": "Te has suscrito exitosamente a la categoría \"Tecnología\""
}
```

**📧 Se enviará un correo de confirmación al usuario.**

### 3.2 Suscribirse a Más Categorías

Repite el proceso con diferentes categorías:

```json
{"categoriaId": 2}  // Deportes
```

```json
{"categoriaId": 4}  // Empleo
```

### 3.3 Ver Mis Suscripciones

**GET** `/suscripciones`

Headers:
```
Authorization: Bearer {access_token_user}
```

**Respuesta esperada (200):**
```json
{
  "items": [
    {
      "id": 1,
      "categoria": {
        "id": 1,
        "nombre": "Tecnología",
        "descripcion": "..."
      }
    },
    ...
  ],
  "total": 3,
  "message": "Tienes 3 suscripción(es) activa(s)"
}
```

### 3.4 Desuscribirse de una Categoría

**DELETE** `/suscripciones`

Headers:
```
Authorization: Bearer {access_token_user}
```

Body:
```json
{
  "categoriaId": 2
}
```

**Respuesta esperada (200):**
```json
{
  "success": true,
  "message": "Te has desuscrito exitosamente de la categoría \"Deportes\""
}
```

**📧 Se enviará un correo de confirmación con las preferencias actualizadas.**

---

## 4️⃣ ANUNCIOS

### 4.1 Crear Anuncios (requiere admin)

**POST** `/anuncios`

Headers:
```
Authorization: Bearer {access_token_admin}
```

Body:
```json
{
  "titulo": "Nuevo iPhone 15 en Oferta",
  "contenido": "Aprovecha nuestra oferta especial del iPhone 15. Solo por tiempo limitado con 20% de descuento.",
  "categoriaId": 1
}
```

**📧 Todos los usuarios suscritos a "Tecnología" recibirán un correo con este anuncio.**

**Crear más anuncios:**

```json
{
  "titulo": "Torneo de Fútbol Regional",
  "contenido": "Inscripciones abiertas para el torneo regional. Equipos de 11 jugadores.",
  "categoriaId": 2
}
```

```json
{
  "titulo": "Se Busca Desarrollador Full Stack",
  "contenido": "Empresa tecnológica busca desarrollador con experiencia en Node.js y React. Salario competitivo.",
  "categoriaId": 4
}
```

### 4.2 Listar Todos los Anuncios (público)

**GET** `/anuncios`

Query params:
- `page=1` (opcional)
- `limit=10` (opcional)
- `categoria=1` (opcional, filtrar por categoría)
- `sortBy=fechaPublicacion` (opcional)
- `sortDir=DESC` (opcional)

Ejemplos:

```
GET /anuncios
GET /anuncios?page=1&limit=5
GET /anuncios?categoria=1
GET /anuncios?categoria=1&sortDir=ASC
```

**Respuesta esperada (200):**
```json
{
  "items": [
    {
      "id": 1,
      "titulo": "Nuevo iPhone 15 en Oferta",
      "contenido": "...",
      "categoria": {
        "id": 1,
        "nombre": "Tecnología"
      },
      "fechaPublicacion": "2025-11-06T...",
      "createdAt": "...",
      "updatedAt": "..."
    },
    ...
  ],
  "total": 3,
  "page": 1,
  "limit": 10,
  "pages": 1,
  "message": "Se encontraron 3 anuncio(s)"
}
```

### 4.3 Ver Mis Anuncios (categorías suscritas)

**GET** `/anuncios/mis-anuncios`

Headers:
```
Authorization: Bearer {access_token_user}
```

**Respuesta esperada (200):**
```json
{
  "items": [
    {
      "id": 1,
      "titulo": "Nuevo iPhone 15 en Oferta",
      "contenido": "...",
      "categoria": {...}
    },
    {
      "id": 3,
      "titulo": "Se Busca Desarrollador Full Stack",
      "contenido": "...",
      "categoria": {...}
    }
  ],
  "total": 2,
  "categoriasSubscritas": ["Tecnología", "Empleo"],
  "message": "Se encontraron 2 anuncio(s) en tus categorías suscritas"
}
```

### 4.4 Obtener un Anuncio (público)

**GET** `/anuncios/1`

### 4.5 Actualizar Anuncio (requiere admin)

**PATCH** `/anuncios/1`

Headers:
```
Authorization: Bearer {access_token_admin}
```

Body:
```json
{
  "titulo": "iPhone 15 - Oferta Extendida",
  "contenido": "Extendimos la oferta del iPhone 15. 25% de descuento!"
}
```

### 4.6 Eliminar Anuncio (requiere admin)

**DELETE** `/anuncios/2`

Headers:
```
Authorization: Bearer {access_token_admin}
```

**Respuesta esperada (200):**
```json
{
  "success": true,
  "message": "El anuncio con ID 2 fue eliminado exitosamente"
}
```

---

## 5️⃣ GESTIÓN DE USUARIOS (Admin)

### 5.1 Obtener Usuario

**GET** `/users/1`

Headers:
```
Authorization: Bearer {access_token_admin}
```

### 5.2 Actualizar Usuario

**PATCH** `/users/1`

Headers:
```
Authorization: Bearer {access_token_admin}
```

Body:
```json
{
  "activo": false
}
```

**Desactivar un usuario**: Cuando un usuario está inactivo, no puede iniciar sesión.

---

## 🧪 CASOS DE PRUEBA IMPORTANTES

### ❌ Errores de Validación

#### Registro con contraseña débil
```json
{
  "nombre": "Test",
  "apellido": "User",
  "nombreUsuario": "test",
  "email": "test@test.com",
  "password": "12345",
  "role": "user"
}
```

**Respuesta (400):**
```json
{
  "success": false,
  "statusCode": 400,
  "message": [
    "La contraseña debe tener al menos 8 caracteres",
    "La contraseña debe contener al menos una mayúscula, un número y un símbolo"
  ]
}
```

#### Email duplicado
Intentar registrar un usuario con email ya existente.

**Respuesta (400):**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "El email ya está registrado"
}
```

#### Login con usuario inactivo
**Respuesta (401):**
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Tu cuenta está inactiva. Contacta al administrador"
}
```

#### Acceso sin autenticación
**Respuesta (401):**
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### Acceso sin permisos
Usuario normal intentando crear categoría.

**Respuesta (403):**
```json
{
  "success": false,
  "statusCode": 403,
  "message": "No tienes permisos para esta acción"
}
```

### ✅ Casos de Éxito

#### Suscripción duplicada
Intentar suscribirse dos veces a la misma categoría.

**Respuesta (400):**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Ya estás suscrito a la categoría \"Tecnología\""
}
```

#### Anuncios sin resultados
**Respuesta (200):**
```json
{
  "items": [],
  "total": 0,
  "message": "No se encontraron anuncios con los criterios especificados"
}
```

---

## 📊 Flujo Completo de Prueba

### Escenario: Usuario se suscribe y recibe notificaciones

1. **Usuario se registra** → `POST /auth/register`
2. **Usuario inicia sesión** → `POST /auth/login` (guarda token)
3. **Ver categorías disponibles** → `GET /categorias`
4. **Suscribirse a "Tecnología"** → `POST /suscripciones` con `categoriaId: 1`
5. **📧 Recibe correo** de confirmación de suscripción
6. **Admin crea anuncio** en "Tecnología" → `POST /anuncios`
7. **📧 Usuario recibe correo** con el nuevo anuncio
8. **Usuario ve sus anuncios** → `GET /anuncios/mis-anuncios`
9. **Usuario se desuscribe** → `DELETE /suscripciones`
10. **📧 Recibe correo** de confirmación (ahora sin suscripciones)

---

## 🔍 Verificación de Emails

Para verificar que los emails se están enviando:

1. Revisa la consola del servidor (logs)
2. Revisa la bandeja de entrada del email configurado
3. Si usas Gmail, verifica la carpeta de "Spam" o "Promociones"

### Ejemplo de log exitoso:
```
[MailService] Correo de nuevo anuncio enviado a maria@example.com
[AnunciosService] Enviando notificaciones a 3 suscriptores
```

---

## 🎯 Rate Limiting

El sistema tiene un límite de 5 peticiones cada 10 segundos para proteger contra abuso.

Si excedes el límite:

**Respuesta (429):**
```json
{
  "success": false,
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

**Solución**: Espera 10 segundos antes de volver a intentar.

---

## 📝 Notas Importantes

1. Todos los endpoints que devuelven listas incluyen un campo `message` descriptivo
2. Los errores siempre incluyen información útil para el cliente
3. Las contraseñas nunca se devuelven en las respuestas
4. Los tokens JWT expiran según la configuración (por defecto 3600s = 1 hora)
5. Los IDs se validan automáticamente con `ParseIntPipe`
6. Las validaciones se ejecutan antes de llegar a los controladores

---

## ✨ Swagger UI

Para una experiencia interactiva de pruebas, visita:

**http://localhost:3000/docs**

Ahí puedes:
- Ver todos los endpoints disponibles
- Probar las peticiones directamente desde el navegador
- Ver los esquemas de los DTOs
- Autorizar con tu token JWT

---

¡Feliz testing! 🚀
