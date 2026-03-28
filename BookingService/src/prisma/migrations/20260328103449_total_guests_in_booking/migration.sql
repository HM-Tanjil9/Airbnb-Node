/*
  Warnings:

  - You are about to drop the column `totalGuest` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `totalGuests` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Booking` DROP COLUMN `totalGuest`,
    ADD COLUMN `totalGuests` INTEGER NOT NULL;
