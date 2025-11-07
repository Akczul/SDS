# 🔄 INSTRUCCIONES DE MIGRACIÓN DE BASE DE DATOS

## 📋 Resumen

Este documento explica cómo corregir el esquema de la base de datos para que coincida con las entidades de NestJS/TypeORM del proyecto.

## ⚠️ IMPORTANTE - LEE ANTES DE EJECUTAR

- **Haz un respaldo completo** de tu base de datos antes de ejecutar la migración
- La migración **eliminará y recreará** las tablas `anuncios` y `suscripciones`
- Los datos existentes se intentarán preservar pero pueden requerir ajustes manuales
- El usuario **admin ya creado se preservará** automáticamente

## 📊 Cambios que se realizarán

### 1. Tabla `categorias` (NUEVA)
```sql
CREATE TABLE categorias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(50) UNIQUE NOT NULL,
  descripcion VARCHAR(255),
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
)
```

**Categorías iniciales:**
- Tecnología
- Deportes
- Entretenimiento
- Empleo
- Educación

### 2. Tabla `anuncios` (MODIFICADA)
**Antes:**
```sql
categoria VARCHAR(50)  -- ❌ Campo de texto
```

**Después:**
```sql
categoriaId INT NOT NULL,  -- ✅ Foreign Key a categorias
CONSTRAINT FK_anuncios_categoria FOREIGN KEY (categoriaId) 
  REFERENCES categorias(id) ON DELETE RESTRICT
```

### 3. Tabla `suscripciones` (MODIFICADA)
**Antes:**
```sql
categoria VARCHAR(50)  -- ❌ Campo de texto
```

**Después:**
```sql
categoriaId INT NOT NULL,  -- ✅ Foreign Key a categorias
CONSTRAINT FK_suscripciones_categoria FOREIGN KEY (categoriaId) 
  REFERENCES categorias(id) ON DELETE CASCADE
```

### 4. Tabla `users` (SIN CAMBIOS)
- Se preserva exactamente igual
- Tu usuario **admin** no se verá afectado

---

## 🚀 PASO A PASO - EJECUCIÓN DE LA MIGRACIÓN

### Opción 1: Usando MySQL Workbench (RECOMENDADA)

1. **Abrir MySQL Workbench**

2. **Conectarse a tu servidor MySQL**
   - Host: `localhost:3306`
   - Usuario: `root`
   - Contraseña: `changeme` (la que configuraste)

3. **Crear respaldo (MUY IMPORTANTE)**
   ```
   Menú > Server > Data Export
   - Seleccionar: sistema_anuncios
   - Export to Self-Contained File
   - Guardar en: C:\backups\sistema_anuncios_backup_FECHA.sql
   - Click en "Start Export"
   ```

4. **Abrir el script de migración**
   ```
   Menú > File > Open SQL Script
   - Seleccionar: C:\Users\Jhoan\OneDrive\Documentos\GitHub\SDS\database\migration-fix-schema.sql
   ```

5. **Verificar que la base de datos esté seleccionada**
   ```sql
   USE sistema_anuncios;
   ```

6. **Ejecutar el script completo**
   - Click en el icono del rayo ⚡ (Execute)
   - Observar los mensajes de resultado
   - Verificar que no haya errores

7. **Verificar resultado**
   ```sql
   -- Ver estructura de las tablas
   SHOW TABLES;
   
   -- Verificar categorías creadas
   SELECT * FROM categorias;
   
   -- Verificar que el usuario admin sigue existiendo
   SELECT id, nombreUsuario, email, role FROM users;
   
   -- Verificar Foreign Keys
   SELECT 
     TABLE_NAME,
     CONSTRAINT_NAME,
     REFERENCED_TABLE_NAME
   FROM information_schema.KEY_COLUMN_USAGE
   WHERE TABLE_SCHEMA = 'sistema_anuncios'
     AND REFERENCED_TABLE_NAME IS NOT NULL;
   ```

### Opción 2: Usando línea de comandos MySQL

1. **Crear respaldo**
   ```powershell
   # En PowerShell
   cd C:\Program Files\MySQL\MySQL Server 8.4\bin
   .\mysqldump.exe -u root -p sistema_anuncios > C:\backups\sistema_anuncios_backup.sql
   # Ingresa la contraseña: changeme
   ```

2. **Ejecutar migración**
   ```powershell
   .\mysql.exe -u root -p sistema_anuncios < "C:\Users\Jhoan\OneDrive\Documentos\GitHub\SDS\database\migration-fix-schema.sql"
   # Ingresa la contraseña: changeme
   ```

3. **Verificar resultado**
   ```powershell
   .\mysql.exe -u root -p
   # Ingresa la contraseña
   
   USE sistema_anuncios;
   SHOW TABLES;
   SELECT * FROM categorias;
   ```

---

## 🔍 VERIFICACIÓN POST-MIGRACIÓN

### Verificar que todo esté correcto:

```sql
-- 1. Verificar que existan las 4 tablas
SHOW TABLES;
-- Debe mostrar: anuncios, categorias, suscripciones, users

-- 2. Verificar estructura de categorias
DESC categorias;

-- 3. Verificar Foreign Keys de anuncios
SHOW CREATE TABLE anuncios;
-- Debe mostrar: CONSTRAINT `FK_anuncios_categoria` FOREIGN KEY...

-- 4. Verificar Foreign Keys de suscripciones
SHOW CREATE TABLE suscripciones;
-- Debe mostrar: CONSTRAINT `FK_suscripciones_categoria` FOREIGN KEY...
-- Debe mostrar: CONSTRAINT `FK_suscripciones_user` FOREIGN KEY...

-- 5. Verificar categorías iniciales
SELECT id, nombre, descripcion FROM categorias;
-- Debe mostrar 5 categorías

-- 6. Verificar usuario admin
SELECT id, nombreUsuario, email, role, activo FROM users;
-- Debe mostrar tu usuario admin

-- 7. Verificar índice único en suscripciones
SHOW INDEXES FROM suscripciones WHERE Key_name = 'UQ_suscripciones_user_categoria';
-- Debe mostrar el índice único compuesto
```

### ✅ Resultados esperados:

| Tabla | Registros esperados |
|-------|---------------------|
| categorias | 5 (categorías por defecto) |
| users | 1 (tu usuario admin) |
| anuncios | 0 o datos migrados |
| suscripciones | 0 o datos migrados |

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Error: "Cannot add foreign key constraint"

**Causa:** Puede haber datos inconsistentes que impiden crear el Foreign Key.

**Solución:**
```sql
-- Ver anuncios sin categoría válida
SELECT * FROM anuncios WHERE categoriaId NOT IN (SELECT id FROM categorias);

-- Actualizar manualmente o eliminar registros inválidos
```

### Error: "Duplicate entry for key 'UQ_suscripciones_user_categoria'"

**Causa:** Existen suscripciones duplicadas en la tabla antigua.

**Solución:**
```sql
-- Encontrar duplicados
SELECT userId, categoriaId, COUNT(*) 
FROM suscripciones 
GROUP BY userId, categoriaId 
HAVING COUNT(*) > 1;

-- Eliminar duplicados manualmente antes de la migración
```

### Error: "Table 'anuncios_backup' doesn't exist"

**Causa:** La tabla temporal no se creó correctamente.

**Solución:**
- Verificar que tengas permisos para crear tablas temporales
- Ejecutar el script paso a paso en lugar de todo junto

---

## 🎯 SIGUIENTES PASOS DESPUÉS DE LA MIGRACIÓN

1. **Actualizar archivo .env** (ver siguiente sección)
2. **Instalar dependencias del proyecto**
3. **Iniciar la aplicación NestJS**
4. **Probar endpoints básicos**

---

## 📝 NOTAS ADICIONALES

### Respaldo automático de TypeORM

Con `synchronize: true` en desarrollo, TypeORM intentará sincronizar el esquema automáticamente. Sin embargo:

- ⚠️ **NO uses `synchronize: true` en producción**
- ✅ Después de la migración manual, puedes dejar `synchronize: true` para desarrollo
- ✅ TypeORM detectará que el esquema ya está correcto

### Datos de prueba

Después de la migración exitosa, puedes:

1. Crear anuncios desde la API REST
2. Crear suscripciones desde la API REST
3. Las categorías ya estarán disponibles

### Migración de datos antiguos

Si tenías datos en las tablas antiguas:

- **Anuncios:** Se migrarán asignándoles la categoría "Tecnología" por defecto
- **Suscripciones:** Intentará mapear la categoría VARCHAR al ID correspondiente

**Revisa y ajusta manualmente si es necesario:**

```sql
-- Ver anuncios migrados
SELECT a.id, a.titulo, c.nombre as categoria 
FROM anuncios a 
JOIN categorias c ON a.categoriaId = c.id;

-- Actualizar categoría de un anuncio específico
UPDATE anuncios 
SET categoriaId = (SELECT id FROM categorias WHERE nombre = 'Deportes')
WHERE id = 1;
```

---

## 🆘 ¿NECESITAS AYUDA?

Si encuentras algún problema durante la migración:

1. **NO ejecutes el script múltiples veces sin antes restaurar el respaldo**
2. Revisa los mensajes de error específicos
3. Consulta la sección "Solución de problemas" arriba
4. Restaura el respaldo si algo sale mal:
   ```sql
   DROP DATABASE sistema_anuncios;
   CREATE DATABASE sistema_anuncios;
   SOURCE C:\backups\sistema_anuncios_backup.sql;
   ```

---

## ✅ CHECKLIST DE MIGRACIÓN

- [ ] Crear respaldo completo de la base de datos
- [ ] Verificar conexión a MySQL (localhost:3306)
- [ ] Ejecutar script `migration-fix-schema.sql`
- [ ] Verificar que no haya errores en la ejecución
- [ ] Verificar existencia de tabla `categorias`
- [ ] Verificar Foreign Keys en `anuncios` y `suscripciones`
- [ ] Verificar que usuario admin sigue existiendo
- [ ] Verificar las 5 categorías por defecto
- [ ] Actualizar archivo `.env` (siguiente paso)
- [ ] Iniciar aplicación NestJS y probar

