/*
  Warnings:

  - You are about to drop the column `batchesStockIds` on the `MedicineStock` table. All the data in the column will be lost.
  - Added the required column `medicineStockId` to the `Batchestock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Batchestock" ADD COLUMN     "medicineStockId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MedicineStock" DROP COLUMN "batchesStockIds";

-- AddForeignKey
ALTER TABLE "Batchestock" ADD CONSTRAINT "Batchestock_medicineStockId_fkey" FOREIGN KEY ("medicineStockId") REFERENCES "MedicineStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
