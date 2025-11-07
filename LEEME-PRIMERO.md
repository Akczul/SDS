# ⚡ INICIO RÁPIDO - 3 PASOS

## 🎯 Tu proyecto está completo en código, solo necesita configuración

---

## ✅ PASO 1: MIGRAR BASE DE DATOS (15 min)

### Problema actual:
```
❌ Tu BD tiene: categoria VARCHAR(50)
✅ Necesita: categoriaId INT con Foreign Key
```

### Solución rápida:

1. **Abrir MySQL Workbench**
2. **Conectar:** localhost:3306, root, changeme
3. **Ejecutar:**
   ```
   File > Open SQL Script > 
   database/migration-fix-schema.sql
   
   Click ⚡ Execute
   ```
4. **Verificar:**
   ```sql
   SELECT * FROM categorias;  -- Debe mostrar 5 categorías
   ```

📖 **Guía completa:** `database/INSTRUCCIONES-MIGRACION.md`

---

## ✅ PASO 2: CONFIGURAR EMAIL (10 min)

### Problema actual:
```env
MAIL_USER=tu_correo@gmail.com  ❌ Placeholder
MAIL_PASS=tu_clave_app         ❌ Placeholder
```

### Solución rápida:

1. **Ir a Google:** https://myaccount.google.com/apppasswords
2. **Generar contraseña** (16 caracteres)
3. **Editar .env:**
   ```env
   MAIL_USER=tu_correo_real@gmail.com
   MAIL_PASS=abcdefghijklmnop
   ```

📖 **Guía completa:** `database/CONFIGURACION-ENV.md`

---

## ✅ PASO 3: INICIAR APLICACIÓN (5 min)

```powershell
# Instalar dependencias (primera vez)
npm install

# Iniciar aplicación
npm run start:dev

# Esperar este mensaje:
# [Nest] INFO  Listening on: http://localhost:3000
```

### Verificar:
- **API:** http://localhost:3000
- **Swagger:** http://localhost:3000/docs
- **Health:** http://localhost:3000/health

---

## 🎉 ¡LISTO!

Tu **Sistema de Anuncios y Suscripciones** está funcionando.

### Prueba rápida:
```powershell
curl http://localhost:3000/health
curl http://localhost:3000/categorias
```

---

## 📚 MÁS INFORMACIÓN

| Necesitas... | Lee este archivo |
|--------------|------------------|
| Guía completa de instalación | `INICIO-RAPIDO.md` |
| Cómo probar todos los endpoints | `TESTING.md` |
| Ejemplos de peticiones | `TESTS-EJEMPLOS.md` |
| Detalles de migración BD | `database/INSTRUCCIONES-MIGRACION.md` |
| Configuración .env detallada | `database/CONFIGURACION-ENV.md` |
| Resumen ejecutivo completo | `database/PASOS-OBLIGATORIOS.md` |
| Informe técnico completo | `database/INFORME-FINAL.md` |

---

## 🆘 PROBLEMAS COMUNES

### MySQL no se conecta
```powershell
net start MySQL84
```

### Emails no se envían
- Verificar que MAIL_PASS sea contraseña de aplicación (16 chars)
- Revisar bandeja de spam

### Tabla 'categorias' no existe
- Ejecutar migración (Paso 1)

---

## ✅ TODO COMPLETADO

- [x] Código revisado (22 archivos)
- [x] Documentación creada (10 archivos)
- [x] 0 errores de compilación
- [ ] Base de datos migrada → **HACER PASO 1**
- [ ] Email configurado → **HACER PASO 2**
- [ ] Aplicación corriendo → **HACER PASO 3**

---

**Tiempo total estimado: 30 minutos**

🚀 **¡Comienza ahora!**
