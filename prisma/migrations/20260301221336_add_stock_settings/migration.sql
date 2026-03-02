-- CreateTable
CREATE TABLE "stock_settings" (
    "id" TEXT NOT NULL,
    "stock_id" TEXT NOT NULL,
    "expiration_warning_days" INTEGER NOT NULL DEFAULT 30,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "stock_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stock_settings_stock_id_key" ON "stock_settings"("stock_id");

-- AddForeignKey
ALTER TABLE "stock_settings" ADD CONSTRAINT "stock_settings_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
