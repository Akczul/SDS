-- =====================================================
-- MIGRACIÓN DE BASE DE DATOS
-- Sistema de Anuncios y Suscripciones
-- Fecha: 2025-11-06
-- =====================================================
-- Este script corrige el esquema de la base de datos
-- para que coincida con las entidades de NestJS/TypeORM
-- =====================================================

USE `sistema_anuncios`;

-- =====================================================
-- PASO 1: CREAR TABLA DE CATEGORÍAS (NUEVA)
-- =====================================================

CREATE TABLE IF NOT EXISTS `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_categorias_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar categorías por defecto
INSERT INTO `categorias` (`nombre`, `descripcion`) VALUES
  ('Tecnología', 'Anuncios relacionados con tecnología e innovación'),
  ('Deportes', 'Anuncios sobre eventos deportivos y actividades físicas'),
  ('Entretenimiento', 'Eventos culturales, música y entretenimiento'),
  ('Empleo', 'Ofertas de trabajo y oportunidades laborales'),
  ('Educación', 'Cursos, talleres y formación académica')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

-- =====================================================
-- PASO 2: RESPALDAR DATOS DE ANUNCIOS (SI EXISTEN)
-- =====================================================

-- Crear tabla temporal para respaldar anuncios existentes
CREATE TEMPORARY TABLE IF NOT EXISTS `anuncios_backup` AS 
SELECT * FROM `anuncios`;

-- =====================================================
-- PASO 3: ELIMINAR TABLA ANUNCIOS ANTIGUA
-- =====================================================

DROP TABLE IF EXISTS `anuncios`;

-- =====================================================
-- PASO 4: CREAR NUEVA TABLA ANUNCIOS CON FK A CATEGORÍAS
-- =====================================================

CREATE TABLE `anuncios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contenido` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `fechaPublicacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `categoriaId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_anuncios_categoria` (`categoriaId`),
  CONSTRAINT `FK_anuncios_categoria` FOREIGN KEY (`categoriaId`) REFERENCES `categorias` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PASO 5: RESTAURAR DATOS DE ANUNCIOS (SI EXISTEN)
-- =====================================================

-- Nota: Este paso intentará restaurar anuncios existentes
-- asociándolos a la categoría "Tecnología" por defecto.
-- Ajusta manualmente si es necesario.

INSERT INTO `anuncios` (`id`, `titulo`, `contenido`, `fechaPublicacion`, `createdAt`, `updatedAt`, `categoriaId`)
SELECT 
  `id`, 
  `titulo`, 
  `contenido`, 
  `fechaPublicacion`, 
  `createdAt`, 
  `updatedAt`,
  (SELECT `id` FROM `categorias` WHERE `nombre` = 'Tecnología' LIMIT 1) as `categoriaId`
FROM `anuncios_backup`
WHERE EXISTS (SELECT 1 FROM `anuncios_backup` LIMIT 1);

-- =====================================================
-- PASO 6: RESPALDAR DATOS DE SUSCRIPCIONES (SI EXISTEN)
-- =====================================================

CREATE TEMPORARY TABLE IF NOT EXISTS `suscripciones_backup` AS 
SELECT * FROM `suscripciones`;

-- =====================================================
-- PASO 7: ELIMINAR TABLA SUSCRIPCIONES ANTIGUA
-- =====================================================

DROP TABLE IF EXISTS `suscripciones`;

-- =====================================================
-- PASO 8: CREAR NUEVA TABLA SUSCRIPCIONES CON FK
-- =====================================================

CREATE TABLE `suscripciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `categoriaId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_suscripciones_user_categoria` (`userId`, `categoriaId`),
  KEY `FK_suscripciones_user` (`userId`),
  KEY `FK_suscripciones_categoria` (`categoriaId`),
  CONSTRAINT `FK_suscripciones_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_suscripciones_categoria` FOREIGN KEY (`categoriaId`) REFERENCES `categorias` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PASO 9: RESTAURAR DATOS DE SUSCRIPCIONES (SI EXISTEN)
-- =====================================================

-- Nota: Este paso intentará mapear las categorías antiguas (VARCHAR)
-- a los IDs de la nueva tabla de categorías

INSERT INTO `suscripciones` (`id`, `userId`, `categoriaId`)
SELECT 
  sb.`id`,
  sb.`userId`,
  COALESCE(
    (SELECT c.`id` FROM `categorias` c WHERE c.`nombre` = sb.`categoria` LIMIT 1),
    (SELECT c.`id` FROM `categorias` c WHERE c.`nombre` = 'Tecnología' LIMIT 1)
  ) as `categoriaId`
FROM `suscripciones_backup` sb
WHERE EXISTS (SELECT 1 FROM `suscripciones_backup` LIMIT 1);

-- =====================================================
-- PASO 10: LIMPIAR TABLAS TEMPORALES
-- =====================================================

DROP TEMPORARY TABLE IF EXISTS `anuncios_backup`;
DROP TEMPORARY TABLE IF EXISTS `suscripciones_backup`;

-- =====================================================
-- VERIFICACIÓN DEL ESQUEMA
-- =====================================================

-- Verificar estructura de categorias
SHOW CREATE TABLE `categorias`;

-- Verificar estructura de anuncios
SHOW CREATE TABLE `anuncios`;

-- Verificar estructura de suscripciones
SHOW CREATE TABLE `suscripciones`;

-- Verificar estructura de users
SHOW CREATE TABLE `users`;

-- Contar registros en cada tabla
SELECT 'categorias' as tabla, COUNT(*) as registros FROM `categorias`
UNION ALL
SELECT 'users' as tabla, COUNT(*) as registros FROM `users`
UNION ALL
SELECT 'anuncios' as tabla, COUNT(*) as registros FROM `anuncios`
UNION ALL
SELECT 'suscripciones' as tabla, COUNT(*) as registros FROM `suscripciones`;

-- =====================================================
-- FIN DE LA MIGRACIÓN
-- =====================================================

SELECT '✅ Migración completada exitosamente!' as mensaje;
SELECT '📋 Tablas actualizadas: categorias (nueva), anuncios (modificada), suscripciones (modificada)' as info;
SELECT '👤 Usuario admin preservado' as usuario;
SELECT '🔗 Foreign Keys creadas correctamente' as relaciones;
