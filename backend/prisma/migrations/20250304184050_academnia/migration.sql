/*
  Warnings:

  - You are about to drop the column `municipio` on the `aspirantes` table. All the data in the column will be lost.
  - You are about to drop the column `provincia` on the `aspirantes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `aspirantes` DROP COLUMN `municipio`,
    DROP COLUMN `provincia`;
