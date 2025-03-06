/*
  Warnings:

  - A unique constraint covering the columns `[public_id]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.
  - The required column `public_id` was added to the `Staff` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `staff` ADD COLUMN `public_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Staff_public_id_key` ON `Staff`(`public_id`);
