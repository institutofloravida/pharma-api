/*
  Warnings:

  - You are about to drop the `_MedicineToTherapeuticClass` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MedicineToTherapeuticClass" DROP CONSTRAINT "_MedicineToTherapeuticClass_A_fkey";

-- DropForeignKey
ALTER TABLE "_MedicineToTherapeuticClass" DROP CONSTRAINT "_MedicineToTherapeuticClass_B_fkey";

-- DropTable
DROP TABLE "_MedicineToTherapeuticClass";

-- CreateTable
CREATE TABLE "_ClassMedicines" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClassMedicines_AB_unique" ON "_ClassMedicines"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassMedicines_B_index" ON "_ClassMedicines"("B");

-- AddForeignKey
ALTER TABLE "_ClassMedicines" ADD CONSTRAINT "_ClassMedicines_A_fkey" FOREIGN KEY ("A") REFERENCES "medicines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassMedicines" ADD CONSTRAINT "_ClassMedicines_B_fkey" FOREIGN KEY ("B") REFERENCES "therapeutic_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
