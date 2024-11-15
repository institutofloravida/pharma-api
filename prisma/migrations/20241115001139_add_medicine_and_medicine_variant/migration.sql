-- CreateTable
CREATE TABLE "Medicine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicine_variants" (
    "id" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "pharmaceuticalFormId" TEXT NOT NULL,
    "unitMeasureId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "medicine_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicine_medicine_variant" (
    "medicineId" TEXT NOT NULL,
    "medicineVariantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "medicine_medicine_variant_pkey" PRIMARY KEY ("medicineId","medicineVariantId")
);

-- CreateTable
CREATE TABLE "medicine_therapeutic_class" (
    "medicineId" TEXT NOT NULL,
    "therapeuticClassId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "medicine_therapeutic_class_pkey" PRIMARY KEY ("medicineId","therapeuticClassId")
);

-- CreateTable
CREATE TABLE "_TherapeuticClassesOnMedicines" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MedicineVariantsOnMedicines" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Medicine_name_idx" ON "Medicine"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_TherapeuticClassesOnMedicines_AB_unique" ON "_TherapeuticClassesOnMedicines"("A", "B");

-- CreateIndex
CREATE INDEX "_TherapeuticClassesOnMedicines_B_index" ON "_TherapeuticClassesOnMedicines"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MedicineVariantsOnMedicines_AB_unique" ON "_MedicineVariantsOnMedicines"("A", "B");

-- CreateIndex
CREATE INDEX "_MedicineVariantsOnMedicines_B_index" ON "_MedicineVariantsOnMedicines"("B");

-- AddForeignKey
ALTER TABLE "medicine_medicine_variant" ADD CONSTRAINT "medicine_medicine_variant_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_medicine_variant" ADD CONSTRAINT "medicine_medicine_variant_medicineVariantId_fkey" FOREIGN KEY ("medicineVariantId") REFERENCES "medicine_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_therapeutic_class" ADD CONSTRAINT "medicine_therapeutic_class_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_therapeutic_class" ADD CONSTRAINT "medicine_therapeutic_class_therapeuticClassId_fkey" FOREIGN KEY ("therapeuticClassId") REFERENCES "therapeutic_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TherapeuticClassesOnMedicines" ADD CONSTRAINT "_TherapeuticClassesOnMedicines_A_fkey" FOREIGN KEY ("A") REFERENCES "Medicine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TherapeuticClassesOnMedicines" ADD CONSTRAINT "_TherapeuticClassesOnMedicines_B_fkey" FOREIGN KEY ("B") REFERENCES "therapeutic_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MedicineVariantsOnMedicines" ADD CONSTRAINT "_MedicineVariantsOnMedicines_A_fkey" FOREIGN KEY ("A") REFERENCES "Medicine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MedicineVariantsOnMedicines" ADD CONSTRAINT "_MedicineVariantsOnMedicines_B_fkey" FOREIGN KEY ("B") REFERENCES "medicine_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
