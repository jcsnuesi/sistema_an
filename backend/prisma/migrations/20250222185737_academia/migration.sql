-- CreateTable
CREATE TABLE `Aspirantes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombres` VARCHAR(191) NOT NULL,
    `apellidos` VARCHAR(191) NOT NULL,
    `f_nacimiento` VARCHAR(191) NOT NULL,
    `lugar_nacimiento` VARCHAR(191) NOT NULL,
    `nacionalidad` VARCHAR(191) NOT NULL,
    `provincia` VARCHAR(191) NOT NULL,
    `municipio` VARCHAR(191) NOT NULL,
    `estado_civil` VARCHAR(191) NOT NULL,
    `cedula` VARCHAR(191) NOT NULL,
    `dir_calle` VARCHAR(191) NOT NULL,
    `dir_sector` VARCHAR(191) NOT NULL,
    `dir_provincia` VARCHAR(191) NOT NULL,
    `dir_municipio` VARCHAR(191) NOT NULL,
    `celular` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `ocupacion` VARCHAR(191) NOT NULL,
    `genero` VARCHAR(191) NOT NULL,
    `escuela` VARCHAR(191) NOT NULL,
    `sector_educativo` VARCHAR(191) NOT NULL,
    `programa_al_que_aspira` VARCHAR(191) NOT NULL,
    `nombre_madre` VARCHAR(191) NOT NULL,
    `apellido_madre` VARCHAR(191) NOT NULL,
    `telefono_madre` VARCHAR(191) NOT NULL,
    `nombre_padre` VARCHAR(191) NOT NULL,
    `apellido_padre` VARCHAR(191) NOT NULL,
    `telefono_padre` VARCHAR(191) NOT NULL,
    `foto` VARCHAR(191) NULL,
    `anioAplicacion` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Aspirantes_cedula_key`(`cedula`),
    UNIQUE INDEX `Aspirantes_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fact_aspirantes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_aspirantes` INTEGER NOT NULL,
    `estatus_solicitud` VARCHAR(191) NOT NULL DEFAULT 'En Proceso',
    `codigo_sistema` VARCHAR(191) NOT NULL,
    `grupo` INTEGER NOT NULL,
    `genero_grupo` VARCHAR(191) NOT NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Fact_aspirantes_id_aspirantes_key`(`id_aspirantes`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Staff` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombres` VARCHAR(191) NOT NULL,
    `apellidos` VARCHAR(191) NOT NULL,
    `correo_institucional` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role_id` INTEGER NOT NULL,
    `departamento_id` INTEGER NOT NULL,

    UNIQUE INDEX `Staff_correo_institucional_key`(`correo_institucional`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_name` VARCHAR(191) NOT NULL,
    `permisos` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Departamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `departamento_nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Fact_aspirantes` ADD CONSTRAINT `Fact_aspirantes_id_aspirantes_fkey` FOREIGN KEY (`id_aspirantes`) REFERENCES `Aspirantes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Staff` ADD CONSTRAINT `Staff_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Staff` ADD CONSTRAINT `Staff_departamento_id_fkey` FOREIGN KEY (`departamento_id`) REFERENCES `Departamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
