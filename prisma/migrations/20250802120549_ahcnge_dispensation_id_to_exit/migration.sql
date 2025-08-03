/*
  Warnings:

  - You are about to drop the column `dispensation_id` on the `movimentation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dispensation_id]` on the table `exits` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "movimentation" DROP CONSTRAINT "movimentation_dispensation_id_fkey";

-- AlterTable
ALTER TABLE "exits" ADD COLUMN     "dispensation_id" TEXT;

-- AlterTable
ALTER TABLE "movimentation" DROP COLUMN "dispensation_id";

-- CreateIndex
CREATE UNIQUE INDEX "exits_dispensation_id_key" ON "exits"("dispensation_id");

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_dispensation_id_fkey" FOREIGN KEY ("dispensation_id") REFERENCES "dispensations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
