/*
  Warnings:

  - Added the required column `updated_at` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `staff` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `estado` VARCHAR(191) NOT NULL DEFAULT 'Activo',
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;
