/*
  Warnings:

  - You are about to drop the `UseMedicine` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UseMedicine" DROP CONSTRAINT "UseMedicine_medicine_stock_id_fkey";

-- DropTable
DROP TABLE "UseMedicine";

-- CreateTable
CREATE TABLE "use_medicine" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "previous_balance" INTEGER NOT NULL,
    "medicine_stock_id" TEXT NOT NULL,
    "current_balance" INTEGER NOT NULL,
    "used" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "use_medicine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "use_medicine_year_month_medicine_stock_id_key" ON "use_medicine"("year", "month", "medicine_stock_id");

-- AddForeignKey
ALTER TABLE "use_medicine" ADD CONSTRAINT "use_medicine_medicine_stock_id_fkey" FOREIGN KEY ("medicine_stock_id") REFERENCES "medicines_stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
