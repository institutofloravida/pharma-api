/*
  Warnings:

  - You are about to drop the column `movement_type_id` on the `movimentation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transfer_id]` on the table `exits` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transfer_id]` on the table `medicines_entries` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `entry_type` to the `medicines_entries` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('TRANSFER', 'MOVEMENT_TYPE');

-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "movimentation" DROP CONSTRAINT "movimentation_movement_type_id_fkey";

-- AlterTable
ALTER TABLE "exits" ADD COLUMN     "movement_type_id" TEXT,
ADD COLUMN     "transfer_id" TEXT;

-- AlterTable
ALTER TABLE "medicines_entries" ADD COLUMN     "entry_type" "EntryType" NOT NULL,
ADD COLUMN     "movement_type_id" TEXT,
ADD COLUMN     "transfer_id" TEXT;

-- AlterTable
ALTER TABLE "movimentation" DROP COLUMN "movement_type_id";

-- CreateTable
CREATE TABLE "transfers" (
    "id" TEXT NOT NULL,
    "stock_destination_id" TEXT,
    "status" "TransferStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "transfers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exits_transfer_id_key" ON "exits"("transfer_id");

-- CreateIndex
CREATE UNIQUE INDEX "medicines_entries_transfer_id_key" ON "medicines_entries"("transfer_id");

-- AddForeignKey
ALTER TABLE "medicines_entries" ADD CONSTRAINT "medicines_entries_transfer_id_fkey" FOREIGN KEY ("transfer_id") REFERENCES "transfers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicines_entries" ADD CONSTRAINT "medicines_entries_movement_type_id_fkey" FOREIGN KEY ("movement_type_id") REFERENCES "MovementType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_movement_type_id_fkey" FOREIGN KEY ("movement_type_id") REFERENCES "MovementType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_transfer_id_fkey" FOREIGN KEY ("transfer_id") REFERENCES "transfers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
