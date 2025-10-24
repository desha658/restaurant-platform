/*
  Warnings:

  - You are about to drop the column `deliveryTime` on the `restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `hasOffer` on the `restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `minOrder` on the `restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `offer` on the `restaurant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `branch` ADD COLUMN `deliveryTime` VARCHAR(191) NULL,
    ADD COLUMN `hasOffer` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `minOrder` DOUBLE NULL DEFAULT 0,
    ADD COLUMN `offer` INTEGER NULL;

-- AlterTable
ALTER TABLE `restaurant` DROP COLUMN `deliveryTime`,
    DROP COLUMN `hasOffer`,
    DROP COLUMN `minOrder`,
    DROP COLUMN `offer`,
    MODIFY `rating` DOUBLE NULL DEFAULT 4.8;
