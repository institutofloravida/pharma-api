-- CreateTable
CREATE TABLE "UseMedicine" (
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "previous_balance" INTEGER NOT NULL,
    "medicine_stock_id" TEXT NOT NULL,
    "current_balance" INTEGER NOT NULL,
    "used" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "UseMedicine_pkey" PRIMARY KEY ("year","month")
);

-- AddForeignKey
ALTER TABLE "UseMedicine" ADD CONSTRAINT "UseMedicine_medicine_stock_id_fkey" FOREIGN KEY ("medicine_stock_id") REFERENCES "medicines_stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
