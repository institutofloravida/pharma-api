/*
  Warnings:

  - The primary key for the `UseMedicine` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[year,month,medicine_stock_id]` on the table `UseMedicine` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `UseMedicine` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "UseMedicine" DROP CONSTRAINT "UseMedicine_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "UseMedicine_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "UseMedicine_year_month_medicine_stock_id_key" ON "UseMedicine"("year", "month", "medicine_stock_id");
