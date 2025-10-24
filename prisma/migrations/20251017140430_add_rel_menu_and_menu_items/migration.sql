/*
  Warnings:

  - You are about to drop the column `menuId` on the `menuitem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `menuitem` DROP FOREIGN KEY `MenuItem_menuId_fkey`;

-- DropIndex
DROP INDEX `MenuItem_menuId_fkey` ON `menuitem`;

-- AlterTable
ALTER TABLE `menuitem` DROP COLUMN `menuId`;

-- CreateTable
CREATE TABLE `_MenuToMenuItem` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MenuToMenuItem_AB_unique`(`A`, `B`),
    INDEX `_MenuToMenuItem_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_MenuToMenuItem` ADD CONSTRAINT `_MenuToMenuItem_A_fkey` FOREIGN KEY (`A`) REFERENCES `Menu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MenuToMenuItem` ADD CONSTRAINT `_MenuToMenuItem_B_fkey` FOREIGN KEY (`B`) REFERENCES `MenuItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
