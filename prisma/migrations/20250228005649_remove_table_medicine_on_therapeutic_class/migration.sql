/*
  Warnings:

  - You are about to drop the `medicine_therapeutic_class` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "medicine_therapeutic_class" DROP CONSTRAINT "medicine_therapeutic_class_medicine_id_fkey";

-- DropForeignKey
ALTER TABLE "medicine_therapeutic_class" DROP CONSTRAINT "medicine_therapeutic_class_therapeutic_class_id_fkey";

-- DropTable
DROP TABLE "medicine_therapeutic_class";

-- CreateTable
CREATE TABLE "_MedicineToTherapeuticClass" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MedicineToTherapeuticClass_AB_unique" ON "_MedicineToTherapeuticClass"("A", "B");

-- CreateIndex
CREATE INDEX "_MedicineToTherapeuticClass_B_index" ON "_MedicineToTherapeuticClass"("B");

-- AddForeignKey
ALTER TABLE "_MedicineToTherapeuticClass" ADD CONSTRAINT "_MedicineToTherapeuticClass_A_fkey" FOREIGN KEY ("A") REFERENCES "medicines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MedicineToTherapeuticClass" ADD CONSTRAINT "_MedicineToTherapeuticClass_B_fkey" FOREIGN KEY ("B") REFERENCES "therapeutic_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
