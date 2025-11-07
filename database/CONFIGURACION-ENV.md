# ⚙️ CONFIGURACIÓN DEL ARCHIVO .ENV

## 📋 Estado actual del archivo .env

Tu archivo `.env` tiene la configuración básica pero necesita ajustes para producción y funcionalidad completa.

---

## 🔍 REVISIÓN DETALLADA POR SECCIÓN

### 1️⃣ **CONFIGURACIÓN DE BASE DE DATOS** ✅

```env
DB_HOST=localhost          # ✅ CORRECTO
DB_PORT=3306              # ✅ CORRECTO
DB_USER=root              # ✅ CORRECTO
DB_PASS=changeme          # ✅ CORRECTO (para desarrollo local)
DB_NAME=sistema_anuncios  # ✅ CORRECTO
```

**Estado:** ✅ **CORRECTO** - La configuración coincide con tu instalación de MySQL.

**Recomendaciones para producción:**
```env
# En producción, NUNCA uses el usuario root
DB_USER=app_user
DB_PASS=contraseña_fuerte_aleatoria_123456!@#
```

---

### 2️⃣ **CONFIGURACIÓN DE JWT** ⚠️

```env
JWT_SECRET=super_secret_key    # ⚠️ CAMBIAR EN PRODUCCIÓN
JWT_EXPIRES=3600s              # ✅ CORRECTO (1 hora)
```

**Estado:** ⚠️ **REQUIERE CAMBIO PARA PRODUCCIÓN**

**Problema:**
- `super_secret_key` es demasiado predecible y débil para producción

**Solución para desarrollo:** Puedes dejarlo así temporalmente

**Solución para producción:** Usa una clave segura generada aleatoriamente

**Generar JWT_SECRET seguro en PowerShell:**
```powershell
# Generar clave aleatoria de 64 caracteres
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

**Ejemplo de JWT_SECRET seguro:**
```env
JWT_SECRET=K8mPq3wX9vN2bF7jR5tY1cZ6hL4sD0gA3kM8pQ2wE7rT9yU1iO5pL6kJ4hG3fD2s
```

---

### 3️⃣ **CONFIGURACIÓN DE EMAIL** ❌

```env
MAIL_HOST=smtp.gmail.com           # ✅ CORRECTO
MAIL_PORT=587                      # ✅ CORRECTO
MAIL_SECURE=false                  # ✅ CORRECTO (TLS en 587)
MAIL_USER=tu_correo@gmail.com      # ❌ PLACEHOLDER - DEBE CAMBIARSE
MAIL_PASS=tu_clave_app             # ❌ PLACEHOLDER - DEBE CAMBIARSE
```

**Estado:** ❌ **REQUIERE CONFIGURACIÓN OBLIGATORIA**

**Problema:**
- El sistema NO podrá enviar emails de notificación sin credenciales reales
- Los anuncios nuevos no notificarán a los suscriptores
- Las confirmaciones de suscripción fallarán

**Solución:** Configurar credenciales de Gmail reales

---

## 📧 CÓMO CONFIGURAR EMAIL CON GMAIL

### Opción 1: Usar Gmail con Contraseña de Aplicación (RECOMENDADA)

#### Paso 1: Habilitar verificación en 2 pasos

1. Ve a tu **Cuenta de Google**: https://myaccount.google.com
2. Click en **Seguridad** (menú izquierdo)
3. En "Acceso a Google", activa **Verificación en 2 pasos**
4. Sigue los pasos para configurarla (usa tu teléfono)

#### Paso 2: Crear contraseña de aplicación

1. Regresa a **Seguridad** de tu cuenta Google
2. En "Acceso a Google", click en **Contraseñas de aplicaciones**
   - URL directa: https://myaccount.google.com/apppasswords
3. Selecciona:
   - **Aplicación:** Correo
   - **Dispositivo:** Otro (personalizado)
   - **Nombre:** "Sistema Anuncios NestJS"
4. Click en **Generar**
5. **Copia la contraseña de 16 caracteres** (aparece sin espacios)

#### Paso 3: Actualizar .env

```env
MAIL_USER=tu_correo_real@gmail.com
MAIL_PASS=abcd efgh ijkl mnop    # La contraseña de 16 caracteres generada
```

**Ejemplo real:**
```env
MAIL_USER=jhoan.developer@gmail.com
MAIL_PASS=xkcd wvut srqp onml
```

---

### Opción 2: Usar Gmail con OAuth2 (AVANZADA)

Si prefieres mayor seguridad, puedes configurar OAuth2:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=tu_correo@gmail.com
OAUTH_CLIENT_ID=tu_client_id.apps.googleusercontent.com
OAUTH_CLIENT_SECRET=tu_client_secret
OAUTH_REFRESH_TOKEN=tu_refresh_token
```

**Nota:** Esto requiere modificar el código de `mail.service.ts`. Por simplicidad, usa la Opción 1.

---

### Opción 3: Usar otros servicios de email

#### SendGrid (Profesional)
```env
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=apikey
MAIL_PASS=tu_sendgrid_api_key
```

#### Mailgun
```env
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=postmaster@tu-dominio.mailgun.org
MAIL_PASS=tu_mailgun_password
```

#### Outlook/Hotmail
```env
MAIL_HOST=smtp-mail.outlook.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=tu_correo@outlook.com
MAIL_PASS=tu_contraseña
```

---

### 4️⃣ **CONFIGURACIÓN DE APLICACIÓN** ✅

```env
APP_URL=http://localhost:3000    # ✅ CORRECTO para desarrollo
```

**Estado:** ✅ **CORRECTO para desarrollo**

**Para producción:**
```env
APP_URL=https://tu-dominio.com
```

---

## 📝 ARCHIVO .ENV COMPLETO RECOMENDADO

### Para Desarrollo Local (Mínimo funcional)

```env
# ==========================================
# CONFIGURACIÓN DE BASE DE DATOS
# ==========================================
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=changeme
DB_NAME=sistema_anuncios

# ==========================================
# CONFIGURACIÓN DE JWT
# ==========================================
JWT_SECRET=super_secret_key_desarrollo_2025
JWT_EXPIRES=3600s

# ==========================================
# CONFIGURACIÓN DE EMAIL (GMAIL)
# ==========================================
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
# ⚠️ REEMPLAZA CON TUS CREDENCIALES REALES ⚠️
MAIL_USER=tu_correo_real@gmail.com
MAIL_PASS=tu_contraseña_app_de_16_caracteres

# ==========================================
# CONFIGURACIÓN DE APLICACIÓN
# ==========================================
APP_URL=http://localhost:3000
NODE_ENV=development

# ==========================================
# CONFIGURACIÓN ADICIONAL (OPCIONAL)
# ==========================================
# Puerto de la aplicación (por defecto 3000)
PORT=3000

# Nivel de logging (opcional)
LOG_LEVEL=debug
```

---

### Para Producción

```env
# ==========================================
# CONFIGURACIÓN DE BASE DE DATOS
# ==========================================
DB_HOST=tu-servidor-mysql.com
DB_PORT=3306
DB_USER=app_user_prod
DB_PASS=P@ssw0rd_Pr0d_S3gur4_2025!
DB_NAME=sistema_anuncios_prod

# ==========================================
# CONFIGURACIÓN DE JWT
# ==========================================
# Generar con: openssl rand -hex 64
JWT_SECRET=a7f8d9e2c4b6f1a3e5d7c9b2f4a6e8d1c3b5f7a9e2d4c6b8f1a3e5d7c9b2f4a6e8
JWT_EXPIRES=7200s

# ==========================================
# CONFIGURACIÓN DE EMAIL (SENDGRID)
# ==========================================
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=apikey
MAIL_PASS=SG.xyz123abc456def789...

# ==========================================
# CONFIGURACIÓN DE APLICACIÓN
# ==========================================
APP_URL=https://sistema-anuncios.tu-dominio.com
NODE_ENV=production
PORT=3000
LOG_LEVEL=error
```

---

## 🚀 PASOS PARA ACTUALIZAR TU .ENV

### 1. Configurar credenciales de Gmail (OBLIGATORIO)

```powershell
# Editar el archivo .env
code .env
```

Actualiza estas líneas:
```env
MAIL_USER=tu_correo_real@gmail.com        # ← Cambiar
MAIL_PASS=tu_contraseña_app_gmail         # ← Cambiar
```

### 2. (Opcional) Mejorar JWT_SECRET

```env
# Generar nuevo secreto en PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})

# Copiar resultado y pegar en .env
JWT_SECRET=resultado_generado_aqui
```

### 3. Guardar cambios

- Guarda el archivo `.env`
- **NO** lo subas a Git (ya está en `.gitignore`)

### 4. Reiniciar la aplicación

```powershell
# Si la aplicación está corriendo, detenerla con Ctrl+C
# Luego iniciarla de nuevo
npm run start:dev
```

---

## 🔒 SEGURIDAD DEL ARCHIVO .ENV

### ✅ BUENAS PRÁCTICAS

1. **NUNCA** subas `.env` a Git
   ```gitignore
   # Verificar que esté en .gitignore
   .env
   .env.local
   .env.production
   ```

2. **USA** diferentes archivos para cada entorno:
   ```
   .env.development    # Desarrollo local
   .env.staging        # Servidor de pruebas
   .env.production     # Servidor de producción
   ```

3. **CREA** un archivo `.env.example` con valores de ejemplo:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASS=tu_contraseña_aqui
   # ... etc
   ```

4. **ROTA** las credenciales periódicamente en producción

5. **USA** servicios de gestión de secretos en producción:
   - Azure Key Vault
   - AWS Secrets Manager
   - HashiCorp Vault
   - Variables de entorno del servidor

---

## 🧪 PROBAR LA CONFIGURACIÓN

### Verificar conexión a base de datos

```powershell
npm run start:dev
```

Deberías ver:
```
[Nest] INFO  [TypeOrmModule] Successfully connected to database
```

### Verificar envío de emails

1. Inicia la aplicación
2. Registra un usuario nuevo (POST `/auth/register`)
3. Suscríbete a una categoría (POST `/suscripciones`)
4. Verifica que llegue el email de confirmación

Si el email NO llega:
- Verifica las credenciales en `.env`
- Revisa la bandeja de spam
- Verifica logs de la aplicación para errores

---

## 📊 CHECKLIST DE CONFIGURACIÓN .ENV

- [ ] Archivo `.env` existe en la raíz del proyecto
- [ ] `DB_PASS` coincide con tu contraseña de MySQL
- [ ] `DB_NAME` es `sistema_anuncios`
- [ ] `MAIL_USER` tiene tu correo real de Gmail
- [ ] `MAIL_PASS` tiene la contraseña de aplicación de Gmail (16 caracteres)
- [ ] Verificación en 2 pasos habilitada en Gmail
- [ ] Contraseña de aplicación generada en Google
- [ ] Archivo `.env` NO está en el repositorio Git
- [ ] Aplicación inicia sin errores de conexión
- [ ] Emails de prueba se envían correctamente

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "ER_ACCESS_DENIED_ERROR"
```
Solución: Verificar DB_USER y DB_PASS en .env
```

### Error: "ECONNREFUSED 127.0.0.1:3306"
```
Solución: Verificar que MySQL esté corriendo
Ejecutar: net start MySQL84
```

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"
```
Solución: 
1. Verificar que MAIL_USER sea correcto
2. Verificar que MAIL_PASS sea la contraseña de aplicación (no tu contraseña normal)
3. Verificar que verificación en 2 pasos esté activa
```

### Error: "self signed certificate in certificate chain"
```
Solución: Cambiar en .env:
MAIL_SECURE=false
```

---

## 📚 RECURSOS ADICIONALES

- **Contraseñas de aplicación de Google:** https://support.google.com/accounts/answer/185833
- **Verificación en 2 pasos:** https://support.google.com/accounts/answer/185839
- **Nodemailer Gmail:** https://nodemailer.com/usage/using-gmail/
- **Variables de entorno NestJS:** https://docs.nestjs.com/techniques/configuration

---

## ✅ RESUMEN DE ACCIONES NECESARIAS

| Item | Estado | Acción requerida |
|------|--------|------------------|
| DB_HOST | ✅ | Ninguna |
| DB_PORT | ✅ | Ninguna |
| DB_USER | ✅ | Ninguna (desarrollo) |
| DB_PASS | ✅ | Ninguna (desarrollo) |
| DB_NAME | ✅ | Ninguna |
| JWT_SECRET | ⚠️ | Cambiar para producción |
| JWT_EXPIRES | ✅ | Ninguna |
| MAIL_HOST | ✅ | Ninguna |
| MAIL_PORT | ✅ | Ninguna |
| MAIL_SECURE | ✅ | Ninguna |
| **MAIL_USER** | ❌ | **OBLIGATORIO: Configurar correo real** |
| **MAIL_PASS** | ❌ | **OBLIGATORIO: Configurar contraseña app** |
| APP_URL | ✅ | Ninguna (desarrollo) |

**Acciones mínimas requeridas:** 2
- ❌ Configurar `MAIL_USER`
- ❌ Configurar `MAIL_PASS`

