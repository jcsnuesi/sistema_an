/*
  Warnings:

  - Added the required column `cargo_id` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `staff` ADD COLUMN `cargo_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Cargo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cargo_nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Staff` ADD CONSTRAINT `Staff_cargo_id_fkey` FOREIGN KEY (`cargo_id`) REFERENCES `Cargo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
