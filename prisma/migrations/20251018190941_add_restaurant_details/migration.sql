/*
  Warnings:

  - You are about to drop the column `distance` on the `restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `isOpen` on the `restaurant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `restaurant` DROP COLUMN `distance`,
    DROP COLUMN `isOpen`;
