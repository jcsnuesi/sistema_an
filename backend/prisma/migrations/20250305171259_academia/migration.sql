-- CreateTable
CREATE TABLE `Observacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_aspirantes` INTEGER NOT NULL,
    `observacion` VARCHAR(191) NOT NULL,
    `fecha_creacion` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Observacion` ADD CONSTRAINT `Observacion_id_aspirantes_fkey` FOREIGN KEY (`id_aspirantes`) REFERENCES `Aspirantes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
