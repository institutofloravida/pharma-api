-- CreateEnum
CREATE TYPE "ExitType" AS ENUM ('DISPENSATION', 'EXPIRATION', 'OTHER');

-- CreateTable
CREATE TABLE "Dispensation" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "dispensationDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "exitId" TEXT NOT NULL,

    CONSTRAINT "Dispensation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exit" (
    "id" TEXT NOT NULL,
    "medicineStockId" TEXT NOT NULL,
    "batchestockId" TEXT NOT NULL,
    "operatorId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "exitType" "ExitType" NOT NULL,
    "exitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dispensationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Exit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Dispensation" ADD CONSTRAINT "Dispensation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exit" ADD CONSTRAINT "Exit_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "operators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exit" ADD CONSTRAINT "Exit_batchestockId_fkey" FOREIGN KEY ("batchestockId") REFERENCES "Batchestock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exit" ADD CONSTRAINT "Exit_medicineStockId_fkey" FOREIGN KEY ("medicineStockId") REFERENCES "MedicineStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exit" ADD CONSTRAINT "Exit_dispensationId_fkey" FOREIGN KEY ("dispensationId") REFERENCES "Dispensation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
