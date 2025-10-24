/*
  Warnings:

  - You are about to drop the column `branchId` on the `menuitem` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantId` on the `menuitem` table. All the data in the column will be lost.
  - Added the required column `menuId` to the `MenuItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `menuitem` DROP FOREIGN KEY `MenuItem_branchId_fkey`;

-- DropForeignKey
ALTER TABLE `menuitem` DROP FOREIGN KEY `MenuItem_restaurantId_fkey`;

-- DropIndex
DROP INDEX `MenuItem_branchId_fkey` ON `menuitem`;

-- DropIndex
DROP INDEX `MenuItem_restaurantId_fkey` ON `menuitem`;

-- AlterTable
ALTER TABLE `menuitem` DROP COLUMN `branchId`,
    DROP COLUMN `restaurantId`,
    ADD COLUMN `menuId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Menu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `restaurantId` INTEGER NULL,
    `branchId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Menu` ADD CONSTRAINT `Menu_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `Restaurant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Menu` ADD CONSTRAINT `Menu_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuItem` ADD CONSTRAINT `MenuItem_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `Menu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
