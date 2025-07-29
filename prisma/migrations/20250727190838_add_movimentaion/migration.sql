/*
  Warnings:

  - You are about to drop the column `batche_stock_id` on the `exits` table. All the data in the column will be lost.
  - You are about to drop the column `dispensation_id` on the `exits` table. All the data in the column will be lost.
  - You are about to drop the column `medicine_stock_id` on the `exits` table. All the data in the column will be lost.
  - You are about to drop the column `movement_type_id` on the `exits` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `exits` table. All the data in the column will be lost.
  - You are about to drop the column `batch_stock_id` on the `medicines_entries` table. All the data in the column will be lost.
  - You are about to drop the column `medicine_stock_id` on the `medicines_entries` table. All the data in the column will be lost.
  - You are about to drop the column `movement_type_id` on the `medicines_entries` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `medicines_entries` table. All the data in the column will be lost.
  - Added the required column `stock_id` to the `exits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock_id` to the `medicines_entries` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "exits" DROP CONSTRAINT "exits_batche_stock_id_fkey";

-- DropForeignKey
ALTER TABLE "exits" DROP CONSTRAINT "exits_dispensation_id_fkey";

-- DropForeignKey
ALTER TABLE "exits" DROP CONSTRAINT "exits_medicine_stock_id_fkey";

-- DropForeignKey
ALTER TABLE "exits" DROP CONSTRAINT "exits_movement_type_id_fkey";

-- DropForeignKey
ALTER TABLE "medicines_entries" DROP CONSTRAINT "medicines_entries_batch_stock_id_fkey";

-- DropForeignKey
ALTER TABLE "medicines_entries" DROP CONSTRAINT "medicines_entries_medicine_stock_id_fkey";

-- DropForeignKey
ALTER TABLE "medicines_entries" DROP CONSTRAINT "medicines_entries_movement_type_id_fkey";

-- DropIndex
DROP INDEX "medicines_entries_batch_stock_id_idx";

-- DropIndex
DROP INDEX "medicines_entries_medicine_stock_id_idx";

-- DropIndex
DROP INDEX "medicines_entries_movement_type_id_idx";

-- AlterTable
ALTER TABLE "exits" DROP COLUMN "batche_stock_id",
DROP COLUMN "dispensation_id",
DROP COLUMN "medicine_stock_id",
DROP COLUMN "movement_type_id",
DROP COLUMN "quantity",
ADD COLUMN     "stock_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "medicines_entries" DROP COLUMN "batch_stock_id",
DROP COLUMN "medicine_stock_id",
DROP COLUMN "movement_type_id",
DROP COLUMN "quantity",
ADD COLUMN     "stock_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Movimentation" (
    "id" TEXT NOT NULL,
    "direction" "MovementDirection" NOT NULL,
    "batch_stock_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "movement_type_id" TEXT,
    "dispensation_id" TEXT,
    "exit_id" TEXT,
    "entry_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Movimentation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Movimentation" ADD CONSTRAINT "Movimentation_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "medicines_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimentation" ADD CONSTRAINT "Movimentation_exit_id_fkey" FOREIGN KEY ("exit_id") REFERENCES "exits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimentation" ADD CONSTRAINT "Movimentation_dispensation_id_fkey" FOREIGN KEY ("dispensation_id") REFERENCES "dispensations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimentation" ADD CONSTRAINT "Movimentation_batch_stock_id_fkey" FOREIGN KEY ("batch_stock_id") REFERENCES "batches_stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimentation" ADD CONSTRAINT "Movimentation_movement_type_id_fkey" FOREIGN KEY ("movement_type_id") REFERENCES "MovementType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicines_entries" ADD CONSTRAINT "medicines_entries_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
