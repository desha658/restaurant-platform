/*
  Warnings:

  - You are about to drop the column `menuId` on the `restaurant` table. All the data in the column will be lost.
  - You are about to drop the `_restaurantcategories` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[menuId]` on the table `Branch` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `menuId` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_restaurantcategories` DROP FOREIGN KEY `_RestaurantCategories_A_fkey`;

-- DropForeignKey
ALTER TABLE `_restaurantcategories` DROP FOREIGN KEY `_RestaurantCategories_B_fkey`;

-- DropForeignKey
ALTER TABLE `restaurant` DROP FOREIGN KEY `Restaurant_menuId_fkey`;

-- DropIndex
DROP INDEX `Restaurant_menuId_fkey` ON `restaurant`;

-- AlterTable
ALTER TABLE `branch` ADD COLUMN `closeTime` VARCHAR(191) NULL,
    ADD COLUMN `isOpen` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `openTime` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `category` ADD COLUMN `menuId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `restaurant` DROP COLUMN `menuId`;

-- DropTable
DROP TABLE `_restaurantcategories`;

-- CreateIndex
CREATE UNIQUE INDEX `Branch_menuId_key` ON `Branch`(`menuId`);

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `Menu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
