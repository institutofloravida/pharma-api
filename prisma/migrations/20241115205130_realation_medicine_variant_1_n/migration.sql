/*
  Warnings:

  - You are about to drop the column `createdAt` on the `medicine_variants` table. All the data in the column will be lost.
  - You are about to drop the column `pharmaceuticalFormId` on the `medicine_variants` table. All the data in the column will be lost.
  - You are about to drop the column `unitMeasureId` on the `medicine_variants` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `medicine_variants` table. All the data in the column will be lost.
  - You are about to drop the `_MedicineVariantsOnMedicines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medicine_medicine_variant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `medicine_id` to the `medicine_variants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pharmaceutical_form_id` to the `medicine_variants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_measure_id` to the `medicine_variants` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_MedicineVariantsOnMedicines" DROP CONSTRAINT "_MedicineVariantsOnMedicines_A_fkey";

-- DropForeignKey
ALTER TABLE "_MedicineVariantsOnMedicines" DROP CONSTRAINT "_MedicineVariantsOnMedicines_B_fkey";

-- DropForeignKey
ALTER TABLE "medicine_medicine_variant" DROP CONSTRAINT "medicine_medicine_variant_medicineId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_medicine_variant" DROP CONSTRAINT "medicine_medicine_variant_medicineVariantId_fkey";

-- AlterTable
ALTER TABLE "medicine_variants" DROP COLUMN "createdAt",
DROP COLUMN "pharmaceuticalFormId",
DROP COLUMN "unitMeasureId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "medicine_id" TEXT NOT NULL,
ADD COLUMN     "pharmaceutical_form_id" TEXT NOT NULL,
ADD COLUMN     "unit_measure_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- DropTable
DROP TABLE "_MedicineVariantsOnMedicines";

-- DropTable
DROP TABLE "medicine_medicine_variant";

-- AddForeignKey
ALTER TABLE "medicine_variants" ADD CONSTRAINT "medicine_variants_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
