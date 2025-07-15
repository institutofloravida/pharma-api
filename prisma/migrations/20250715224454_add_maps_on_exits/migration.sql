/*
  Warnings:

  - You are about to drop the column `batchestockId` on the `exits` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `exits` table. All the data in the column will be lost.
  - You are about to drop the column `dispensationId` on the `exits` table. All the data in the column will be lost.
  - You are about to drop the column `exitDate` on the `exits` table. All the data in the column will be lost.
  - You are about to drop the column `exitType` on the `exits` table. All the data in the column will be lost.
  - You are about to drop the column `medicineStockId` on the `exits` table. All the data in the column will be lost.
  - You are about to drop the column `movementTypeId` on the `exits` table. All the data in the column will be lost.
  - You are about to drop the column `operatorId` on the `exits` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `exits` table. All the data in the column will be lost.
  - Added the required column `batche_stock_id` to the `exits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exit_type` to the `exits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicine_stock_id` to the `exits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operator_id` to the `exits` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "exits" DROP CONSTRAINT "exits_batchestockId_fkey";

-- DropForeignKey
ALTER TABLE "exits" DROP CONSTRAINT "exits_dispensationId_fkey";

-- DropForeignKey
ALTER TABLE "exits" DROP CONSTRAINT "exits_medicineStockId_fkey";

-- DropForeignKey
ALTER TABLE "exits" DROP CONSTRAINT "exits_movementTypeId_fkey";

-- DropForeignKey
ALTER TABLE "exits" DROP CONSTRAINT "exits_operatorId_fkey";

-- AlterTable
ALTER TABLE "exits" DROP COLUMN "batchestockId",
DROP COLUMN "createdAt",
DROP COLUMN "dispensationId",
DROP COLUMN "exitDate",
DROP COLUMN "exitType",
DROP COLUMN "medicineStockId",
DROP COLUMN "movementTypeId",
DROP COLUMN "operatorId",
DROP COLUMN "updatedAt",
ADD COLUMN     "batche_stock_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dispensation_id" TEXT,
ADD COLUMN     "exit_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "exit_type" "ExitType" NOT NULL,
ADD COLUMN     "medicine_stock_id" TEXT NOT NULL,
ADD COLUMN     "movement_type_id" TEXT,
ADD COLUMN     "operator_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "operators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_batche_stock_id_fkey" FOREIGN KEY ("batche_stock_id") REFERENCES "batches_stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_medicine_stock_id_fkey" FOREIGN KEY ("medicine_stock_id") REFERENCES "medicines_stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_dispensation_id_fkey" FOREIGN KEY ("dispensation_id") REFERENCES "dispensations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_movement_type_id_fkey" FOREIGN KEY ("movement_type_id") REFERENCES "MovementType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
