-- CreateTable
CREATE TABLE "MedicineEntry" (
    "id" TEXT NOT NULL,
    "medicineStockId" TEXT NOT NULL,
    "batcheStockId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "operatorId" TEXT NOT NULL,
    "movementTypeId" TEXT NOT NULL,
    "entryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "MedicineEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicineStock" (
    "id" TEXT NOT NULL,
    "medicineVariantId" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "currentQuantity" INTEGER NOT NULL,
    "minimumLevel" INTEGER NOT NULL DEFAULT 0,
    "batchesStockIds" TEXT[],
    "lastMove" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "MedicineStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Batchestock" (
    "id" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "medicineVariantId" TEXT NOT NULL,
    "currentQuantity" INTEGER NOT NULL,
    "lastMove" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Batchestock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "manufacturingDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MedicineEntry_medicineStockId_idx" ON "MedicineEntry"("medicineStockId");

-- CreateIndex
CREATE INDEX "MedicineEntry_batcheStockId_idx" ON "MedicineEntry"("batcheStockId");

-- CreateIndex
CREATE INDEX "MedicineEntry_movementTypeId_idx" ON "MedicineEntry"("movementTypeId");

-- CreateIndex
CREATE INDEX "MedicineStock_medicineVariantId_idx" ON "MedicineStock"("medicineVariantId");

-- CreateIndex
CREATE INDEX "MedicineStock_stockId_idx" ON "MedicineStock"("stockId");

-- CreateIndex
CREATE INDEX "Batchestock_stockId_idx" ON "Batchestock"("stockId");

-- CreateIndex
CREATE INDEX "Batchestock_batchId_idx" ON "Batchestock"("batchId");

-- CreateIndex
CREATE INDEX "Batchestock_medicineVariantId_idx" ON "Batchestock"("medicineVariantId");

-- CreateIndex
CREATE UNIQUE INDEX "Batch_code_key" ON "Batch"("code");

-- CreateIndex
CREATE INDEX "Batch_manufacturerId_idx" ON "Batch"("manufacturerId");

-- AddForeignKey
ALTER TABLE "MedicineEntry" ADD CONSTRAINT "MedicineEntry_medicineStockId_fkey" FOREIGN KEY ("medicineStockId") REFERENCES "MedicineStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineEntry" ADD CONSTRAINT "MedicineEntry_batcheStockId_fkey" FOREIGN KEY ("batcheStockId") REFERENCES "Batchestock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineEntry" ADD CONSTRAINT "MedicineEntry_movementTypeId_fkey" FOREIGN KEY ("movementTypeId") REFERENCES "MovementType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineStock" ADD CONSTRAINT "MedicineStock_medicineVariantId_fkey" FOREIGN KEY ("medicineVariantId") REFERENCES "medicine_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineStock" ADD CONSTRAINT "MedicineStock_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batchestock" ADD CONSTRAINT "Batchestock_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batchestock" ADD CONSTRAINT "Batchestock_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batchestock" ADD CONSTRAINT "Batchestock_medicineVariantId_fkey" FOREIGN KEY ("medicineVariantId") REFERENCES "medicine_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
