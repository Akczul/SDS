# 🚀 GUÍA RÁPIDA DE PUESTA EN MARCHA

## 📊 RESUMEN EJECUTIVO

Tu proyecto de **Sistema de Anuncios y Suscripciones** está completo en el código, pero la **base de datos necesita corrección** y el archivo **.env necesita configuración de email**.

---

## ⚡ PASOS OBLIGATORIOS (EN ORDEN)

### ✅ PASO 1: MIGRAR LA BASE DE DATOS (15 minutos)

**Problema detectado:** 
- ❌ Tu base de datos tiene `categoria` como `VARCHAR` 
- ✅ El proyecto necesita `categoriaId` como `INT` con Foreign Key

**Solución:**
1. **Abrir MySQL Workbench**
2. **Conectarse:** localhost:3306, usuario: root, password: changeme
3. **Crear respaldo:**
   ```
   Server > Data Export > sistema_anuncios
   Guardar en: C:\backups\sistema_anuncios_backup.sql
   ```
4. **Ejecutar migración:**
   ```
   File > Open SQL Script > 
   C:\Users\Jhoan\OneDrive\Documentos\GitHub\SDS\database\migration-fix-schema.sql
   
   Luego: Click en ⚡ Execute
   ```
5. **Verificar resultado:**
   ```sql
   SHOW TABLES;  -- Debe mostrar: anuncios, categorias, suscripciones, users
   SELECT * FROM categorias;  -- Debe mostrar 5 categorías
   ```

**📄 Documentación detallada:** `database/INSTRUCCIONES-MIGRACION.md`

---

### ✅ PASO 2: CONFIGURAR EMAIL EN .ENV (10 minutos)

**Problema detectado:**
- ❌ `MAIL_USER=tu_correo@gmail.com` (placeholder)
- ❌ `MAIL_PASS=tu_clave_app` (placeholder)

**Solución:**

#### A. Generar contraseña de aplicación de Gmail:

1. **Ir a tu cuenta Google:** https://myaccount.google.com
2. **Click en "Seguridad"** (menú izquierdo)
3. **Activar "Verificación en 2 pasos"** (si no está activa)
4. **Ir a "Contraseñas de aplicaciones":** https://myaccount.google.com/apppasswords
5. **Generar nueva contraseña:**
   - Aplicación: Correo
   - Dispositivo: Otro (personalizado)
   - Nombre: "Sistema Anuncios NestJS"
6. **Copiar contraseña** (16 caracteres sin espacios)

#### B. Actualizar archivo .env:

```powershell
# Abrir .env en VS Code
code .env
```

Modificar estas líneas:
```env
MAIL_USER=tu_correo_real@gmail.com          # ← Tu Gmail real
MAIL_PASS=abcdefghijklmnop                  # ← Contraseña de 16 caracteres
```

**Guardar y cerrar.**

**📄 Documentación detallada:** `database/CONFIGURACION-ENV.md`

---

### ✅ PASO 3: INSTALAR DEPENDENCIAS (2 minutos)

```powershell
# En la raíz del proyecto
cd C:\Users\Jhoan\OneDrive\Documentos\GitHub\SDS

# Instalar dependencias
npm install
```

---

### ✅ PASO 4: INICIAR LA APLICACIÓN (1 minuto)

```powershell
# Modo desarrollo (con hot-reload)
npm run start:dev
```

**Deberías ver:**
```
[Nest] INFO  [NestFactory] Starting Nest application...
[Nest] INFO  [TypeOrmModule] Successfully connected to database
[Nest] INFO  [NestApplication] Nest application successfully started
[Nest] INFO  Listening on: http://localhost:3000
```

**Acceder a:**
- **API:** http://localhost:3000
- **Documentación Swagger:** http://localhost:3000/docs
- **Health Check:** http://localhost:3000/health

---

## 🧪 VERIFICACIÓN RÁPIDA

### 1. Probar Health Check
```powershell
curl http://localhost:3000/health
```
Respuesta esperada:
```json
{
  "success": true,
  "message": "Sistema funcionando correctamente",
  "data": {
    "status": "ok",
    "timestamp": "2025-11-06T12:00:00.000Z"
  }
}
```

### 2. Listar Categorías
```powershell
curl http://localhost:3000/categorias
```
Respuesta esperada:
```json
{
  "success": true,
  "message": "Categorías obtenidas exitosamente",
  "data": [
    {"id": 1, "nombre": "Tecnología", "descripcion": "..."},
    {"id": 2, "nombre": "Deportes", "descripcion": "..."},
    ...
  ]
}
```

### 3. Registrar Usuario
```powershell
curl -X POST http://localhost:3000/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "nombreUsuario": "juanp",
    "email": "juan@example.com",
    "password": "Password123!"
  }'
```

### 4. Login
```powershell
curl -X POST http://localhost:3000/auth/login `
  -H "Content-Type: application/json" `
  -d '{
    "nombreUsuario": "juanp",
    "password": "Password123!"
  }'
```

Copia el `token` de la respuesta para usarlo en siguientes peticiones.

### 5. Suscribirse a Categoría (requiere token)
```powershell
curl -X POST http://localhost:3000/suscripciones `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer TU_TOKEN_AQUI" `
  -d '{
    "categoriaId": 1
  }'
```

**✅ Deberías recibir un email de confirmación de suscripción.**

### 6. Crear Anuncio (requiere token de admin)
```powershell
curl -X POST http://localhost:3000/anuncios `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer TOKEN_ADMIN_AQUI" `
  -d '{
    "titulo": "Nueva tecnología disponible",
    "contenido": "Se anuncia el lanzamiento de...",
    "categoriaId": 1
  }'
```

**✅ Todos los usuarios suscritos a "Tecnología" deberían recibir un email.**

---

## 📋 CHECKLIST COMPLETO

### Migración de Base de Datos
- [ ] Respaldo de BD creado
- [ ] Script `migration-fix-schema.sql` ejecutado sin errores
- [ ] Tabla `categorias` creada con 5 registros
- [ ] Tabla `anuncios` tiene FK `categoriaId`
- [ ] Tabla `suscripciones` tiene FK `categoriaId` y `userId`
- [ ] Usuario admin sigue existiendo

### Configuración de .env
- [ ] `MAIL_USER` configurado con Gmail real
- [ ] `MAIL_PASS` configurado con contraseña de aplicación
- [ ] Verificación en 2 pasos activada en Gmail
- [ ] Contraseña de aplicación generada correctamente

### Instalación y Ejecución
- [ ] Dependencias instaladas (`npm install`)
- [ ] Aplicación iniciada sin errores (`npm run start:dev`)
- [ ] Conexión a BD exitosa (ver logs)
- [ ] Swagger accesible en http://localhost:3000/docs

### Pruebas Funcionales
- [ ] Health check responde correctamente
- [ ] Categorías se listan correctamente
- [ ] Registro de usuario funciona
- [ ] Login devuelve token JWT
- [ ] Suscripción envía email de confirmación
- [ ] Anuncio nuevo envía emails a suscriptores

---

## 🆘 SOLUCIÓN RÁPIDA DE PROBLEMAS

### ❌ Error: "Cannot connect to database"
```
✅ Verificar que MySQL esté corriendo:
   net start MySQL84
   
✅ Verificar credenciales en .env:
   DB_PASS=changeme
```

### ❌ Error: "Invalid login: Username and Password not accepted"
```
✅ Verificar que MAIL_PASS sea contraseña de aplicación (16 caracteres)
✅ Verificar que verificación en 2 pasos esté activa
✅ Regenerar contraseña de aplicación en Google
```

### ❌ Error: "Table 'categorias' doesn't exist"
```
✅ Ejecutar migración de base de datos (Paso 1)
```

### ❌ Error: "Foreign key constraint fails"
```
✅ Ejecutar migración completa desde cero
✅ Restaurar respaldo si es necesario
```

### ❌ Emails no llegan
```
✅ Verificar credenciales en .env
✅ Revisar bandeja de spam
✅ Verificar logs de aplicación para errores
```

---

## 📚 DOCUMENTACIÓN COMPLETA

El proyecto incluye documentación exhaustiva:

| Archivo | Descripción |
|---------|-------------|
| `README.md` | Visión general del proyecto, arquitectura, endpoints |
| `INICIO-RAPIDO.md` | Guía completa de instalación y configuración |
| `TESTING.md` | Guía de pruebas manuales con Postman/Thunder Client |
| `TESTS-EJEMPLOS.md` | Ejemplos de peticiones para cada endpoint |
| `MEJORAS.md` | Detalles técnicos de todas las mejoras implementadas |
| `CHECKLIST.md` | Lista exhaustiva de verificación del código |
| `database/INSTRUCCIONES-MIGRACION.md` | Guía detallada de migración de BD |
| `database/CONFIGURACION-ENV.md` | Guía completa de configuración .env |

---

## 🎯 PRÓXIMOS PASOS DESPUÉS DE PONER EN MARCHA

1. **Explorar Swagger:** http://localhost:3000/docs
2. **Probar todos los endpoints** con la documentación de `TESTING.md`
3. **Crear más categorías** según tus necesidades
4. **Ajustar templates de email** en `src/mail/templates/`
5. **Configurar CORS** si vas a consumir desde frontend
6. **Implementar rate limiting** para producción
7. **Configurar logging** persistente (Winston, Sentry)
8. **Escribir tests unitarios** (Jest)
9. **Configurar CI/CD** (GitHub Actions)
10. **Desplegar a producción** (AWS, Azure, DigitalOcean)

---

## ✅ CONFIRMACIÓN DE ÉXITO

Si completaste todos los pasos, deberías tener:

✅ Base de datos con estructura correcta  
✅ 5 categorías por defecto creadas  
✅ Sistema de autenticación JWT funcional  
✅ Envío de emails configurado  
✅ API REST completa funcionando  
✅ Documentación Swagger disponible  
✅ Logs informativos en consola  
✅ Manejo de errores consistente  
✅ Validaciones en todos los DTOs  
✅ Relaciones FK correctas entre tablas  

---

## 🎉 ¡LISTO PARA USAR!

Tu **Sistema de Anuncios y Suscripciones por Categoría** está completo y funcional.

**Comandos útiles:**

```powershell
# Iniciar en modo desarrollo
npm run start:dev

# Iniciar en modo producción
npm run build
npm run start:prod

# Ejecutar tests (cuando los crees)
npm run test

# Ver logs de MySQL
# En MySQL Workbench: Server > Server Status
```

**URLs importantes:**

- API: http://localhost:3000
- Swagger: http://localhost:3000/docs
- Health: http://localhost:3000/health

---

## 📞 SOPORTE

Si encuentras algún problema:

1. Revisa los logs de la aplicación en la consola
2. Consulta la documentación específica en `database/`
3. Verifica el checklist completo
4. Revisa las secciones de solución de problemas

¡Éxito con tu proyecto! 🚀

