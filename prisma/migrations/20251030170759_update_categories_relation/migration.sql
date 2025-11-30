/*
  Warnings:

  - You are about to drop the column `branchId` on the `menu` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantId` on the `menu` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `menu` DROP FOREIGN KEY `Menu_branchId_fkey`;

-- DropForeignKey
ALTER TABLE `menu` DROP FOREIGN KEY `Menu_restaurantId_fkey`;

-- DropIndex
DROP INDEX `Menu_branchId_fkey` ON `menu`;

-- DropIndex
DROP INDEX `Menu_restaurantId_fkey` ON `menu`;

-- AlterTable
ALTER TABLE `branch` ADD COLUMN `menuId` INTEGER NULL;

-- AlterTable
ALTER TABLE `menu` DROP COLUMN `branchId`,
    DROP COLUMN `restaurantId`;

-- AlterTable
ALTER TABLE `restaurant` ADD COLUMN `menuId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Restaurant` ADD CONSTRAINT `Restaurant_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `Menu`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Branch` ADD CONSTRAINT `Branch_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `Menu`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
