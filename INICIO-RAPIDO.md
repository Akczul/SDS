# 🚀 INICIO RÁPIDO - Sistema de Anuncios y Suscripciones

## ⚡ Configuración en 5 Minutos

### 1️⃣ Instalar Dependencias
```powershell
npm install
```

### 2️⃣ Configurar Base de Datos MySQL

**Opción A: MySQL Workbench**
```sql
CREATE DATABASE sistema_anuncios CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Opción B: Línea de comandos**
```powershell
mysql -u root -p
```
```sql
CREATE DATABASE sistema_anuncios CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 3️⃣ Crear Archivo .env

Copia el archivo de ejemplo:
```powershell
Copy-Item .env.example .env
```

Edita `.env` con tus credenciales:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=tu_password
DB_NAME=sistema_anuncios

JWT_SECRET=cambia-este-secreto-por-uno-muy-seguro-y-largo
JWT_EXPIRES=3600s

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=tu_email@gmail.com
MAIL_PASS=tu_clave_app_de_gmail

APP_URL=http://localhost:3000
```

### 4️⃣ Configurar Gmail (para notificaciones)

1. Ve a https://myaccount.google.com/security
2. Habilita "Verificación en 2 pasos"
3. Ve a https://myaccount.google.com/apppasswords
4. Genera una contraseña de aplicación
5. Copia esa contraseña en `MAIL_PASS` del archivo `.env`

### 5️⃣ Iniciar el Servidor
```powershell
npm run start:dev
```

Deberías ver:
```
🚀 Server running on http://localhost:3000
📘 Swagger docs at http://localhost:3000/docs
```

---

## 📝 Primeros Pasos

### 1. Abrir Swagger UI
Navega a: http://localhost:3000/docs

### 2. Crear un Administrador
En Swagger, usa el endpoint **POST /auth/register**:

```json
{
  "nombre": "Admin",
  "apellido": "Sistema",
  "nombreUsuario": "admin",
  "email": "admin@example.com",
  "password": "Admin123!",
  "role": "admin"
}
```

### 3. Iniciar Sesión
Usa **POST /auth/login**:

```json
{
  "identifier": "admin",
  "password": "Admin123!"
}
```

**Copia el `access_token` de la respuesta.**

### 4. Autorizar en Swagger
1. Haz clic en el botón **"Authorize"** (candado verde)
2. Pega: `Bearer tu_access_token_aquí`
3. Haz clic en "Authorize"
4. Cierra el modal

### 5. Crear Categorías
Usa **POST /categorias** (ahora autorizado):

```json
{"nombre": "Tecnología", "descripcion": "Anuncios de tecnología"}
```

```json
{"nombre": "Deportes", "descripcion": "Anuncios deportivos"}
```

```json
{"nombre": "Empleo", "descripcion": "Ofertas de trabajo"}
```

### 6. Crear un Usuario Normal
Usa **POST /auth/register** (sin autenticación):

```json
{
  "nombre": "María",
  "apellido": "González",
  "nombreUsuario": "mariag",
  "email": "maria@example.com",
  "password": "Maria123!",
  "role": "user"
}
```

### 7. Login como Usuario
**POST /auth/login**:

```json
{
  "identifier": "mariag",
  "password": "Maria123!"
}
```

Autoriza de nuevo con el nuevo token.

### 8. Suscribirse a Categoría
**POST /suscripciones**:

```json
{"categoriaId": 1}
```

**📧 Recibirás un correo de confirmación!**

### 9. Crear Anuncio (como Admin)
Vuelve a autorizar con el token del admin.

**POST /anuncios**:

```json
{
  "titulo": "Nuevo iPhone 15 en Oferta",
  "contenido": "Aprovecha nuestra oferta especial. Solo por tiempo limitado.",
  "categoriaId": 1
}
```

**📧 María recibirá un correo con este anuncio!**

### 10. Ver Mis Anuncios (como Usuario)
Autoriza con el token de María.

**GET /anuncios/mis-anuncios**

Verás el anuncio del iPhone 15.

---

## 🔍 Verificar que Todo Funciona

### ✅ Base de Datos
Verifica que las tablas se crearon:
```sql
USE sistema_anuncios;
SHOW TABLES;
```

Deberías ver:
- `users`
- `categorias`
- `anuncios`
- `suscripciones`

### ✅ API
- http://localhost:3000 → "Cannot GET /" (normal)
- http://localhost:3000/docs → Swagger UI
- http://localhost:3000/health → (si existe) health check

### ✅ Correos
- Revisa tu bandeja de entrada
- Revisa "Promociones" o "Spam" en Gmail
- Revisa los logs del servidor:
  ```
  [MailService] Correo de nuevo anuncio enviado a maria@example.com
  ```

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to MySQL"
```
❌ Error: ER_ACCESS_DENIED_ERROR
```

**Solución:**
1. Verifica usuario y contraseña en `.env`
2. Verifica que MySQL esté corriendo:
   ```powershell
   Get-Service MySQL*
   ```
3. Prueba conexión:
   ```powershell
   mysql -u root -p
   ```

### Error: "Database does not exist"
```
❌ Error: ER_BAD_DB_ERROR
```

**Solución:**
```sql
CREATE DATABASE sistema_anuncios;
```

### Error: "MAIL_HOST is required"
```
❌ Error: "MAIL_HOST" is required
```

**Solución:**
Asegúrate de tener todas las variables en `.env`:
```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=tu_email@gmail.com
MAIL_PASS=tu_clave_app
```

### Los correos no llegan

**Solución:**
1. Verifica los logs del servidor
2. Verifica que MAIL_USER y MAIL_PASS sean correctos
3. Verifica que sea "Contraseña de aplicación" de Google, no tu contraseña normal
4. Revisa carpeta de Spam
5. Intenta con otro proveedor de correo

### Error: "Port 3000 already in use"
```
❌ Error: EADDRINUSE
```

**Solución:**
```powershell
# Ver qué está usando el puerto
netstat -ano | findstr :3000

# Matar el proceso (reemplaza PID con el número mostrado)
taskkill /PID NUMERO /F

# O cambia el puerto en main.ts:
# await app.listen(3001);
```

---

## 📚 Documentación Completa

- **README.md** - Documentación general
- **TESTING.md** - Guía de pruebas detallada
- **MEJORAS.md** - Resumen de mejoras implementadas
- **CHECKLIST.md** - Lista de verificación completa
- **TESTS-EJEMPLOS.md** - Ejemplos de pruebas unitarias

---

## 🎯 Endpoints Rápidos

### Públicos (sin autenticación)
```
GET  /categorias           - Listar categorías
GET  /categorias/:id       - Ver una categoría
GET  /anuncios             - Listar anuncios
GET  /anuncios/:id         - Ver un anuncio
POST /auth/register        - Registrarse
POST /auth/login           - Iniciar sesión
```

### Autenticados (cualquier usuario)
```
GET    /auth/perfil           - Mi perfil
GET    /suscripciones         - Mis suscripciones
POST   /suscripciones         - Suscribirse
DELETE /suscripciones         - Desuscribirse
GET    /anuncios/mis-anuncios - Mis anuncios
```

### Solo Administrador
```
POST   /categorias      - Crear categoría
PATCH  /categorias/:id  - Actualizar categoría
DELETE /categorias/:id  - Eliminar categoría
POST   /anuncios        - Crear anuncio
PATCH  /anuncios/:id    - Actualizar anuncio
DELETE /anuncios/:id    - Eliminar anuncio
GET    /users/:id       - Ver usuario
PATCH  /users/:id       - Actualizar usuario
```

---

## 🧪 Probar con Postman

### 1. Importar Colección
Usa Swagger para generar la colección:
1. Abre http://localhost:3000/docs
2. Busca el botón "Download" o usa la URL de OpenAPI

### 2. Configurar Variables
- `base_url`: `http://localhost:3000`
- `token_admin`: (tu token de admin)
- `token_user`: (tu token de usuario)

### 3. Autorización
En cada petición protegida:
- Headers → Authorization: `Bearer {{token_admin}}`

---

## ✨ Flujo Completo de Prueba

```
1. Registrar Admin → login → crear categorías
2. Registrar User → login → suscribirse a categorías
3. Admin crea anuncio → User recibe correo
4. User ve sus anuncios
5. User se desuscribe → recibe correo de confirmación
```

---

## 🎓 Siguientes Pasos

1. ✅ Familiarízate con Swagger UI
2. ✅ Lee TESTING.md para casos de prueba
3. ✅ Configura tu correo y prueba notificaciones
4. ✅ Experimenta con diferentes usuarios y roles
5. ✅ Lee README.md para documentación completa

---

## 💡 Tips

- **Swagger es tu amigo**: Úsalo para probar todo
- **Revisa los logs**: El servidor muestra información útil
- **Mensajes descriptivos**: Todas las respuestas tienen mensajes claros
- **Validaciones automáticas**: Los DTOs validan todo por ti
- **Correos en desarrollo**: Usa MailHog o Ethereal para testing sin Gmail

---

## 🆘 Necesitas Ayuda?

1. Revisa los logs del servidor
2. Lee los mensajes de error (son descriptivos)
3. Consulta TESTING.md para ejemplos
4. Revisa CHECKLIST.md para verificar configuración
5. Verifica que .env esté correcto

---

**¡Listo para empezar! 🚀**

Si el servidor está corriendo y ves los mensajes de éxito, ¡ya estás listo para usar el sistema!

Abre http://localhost:3000/docs y explora la API.
