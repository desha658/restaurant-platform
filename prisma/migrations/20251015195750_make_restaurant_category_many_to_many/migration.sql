/*
  Warnings:

  - You are about to drop the column `restaurantId` on the `category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `Category_restaurantId_fkey`;

-- DropIndex
DROP INDEX `Category_restaurantId_fkey` ON `category`;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `restaurantId`;

-- CreateTable
CREATE TABLE `_RestaurantCategories` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RestaurantCategories_AB_unique`(`A`, `B`),
    INDEX `_RestaurantCategories_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_RestaurantCategories` ADD CONSTRAINT `_RestaurantCategories_A_fkey` FOREIGN KEY (`A`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RestaurantCategories` ADD CONSTRAINT `_RestaurantCategories_B_fkey` FOREIGN KEY (`B`) REFERENCES `Restaurant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
