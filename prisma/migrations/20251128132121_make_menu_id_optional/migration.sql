-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `Category_menuId_fkey`;

-- DropIndex
DROP INDEX `Category_menuId_fkey` ON `category`;

-- AlterTable
ALTER TABLE `branch` ADD COLUMN `imageUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `category` MODIFY `menuId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `Menu`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
