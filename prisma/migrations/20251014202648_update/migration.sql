/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerBranchId` to the `Branch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `branch` ADD COLUMN `ownerBranchId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Restaurant_name_key` ON `Restaurant`(`name`);

-- AddForeignKey
ALTER TABLE `Branch` ADD CONSTRAINT `Branch_ownerBranchId_fkey` FOREIGN KEY (`ownerBranchId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
