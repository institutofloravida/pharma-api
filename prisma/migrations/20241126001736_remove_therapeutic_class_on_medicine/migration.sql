/*
  Warnings:

  - You are about to drop the `_TherapeuticClassesOnMedicines` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TherapeuticClassesOnMedicines" DROP CONSTRAINT "_TherapeuticClassesOnMedicines_A_fkey";

-- DropForeignKey
ALTER TABLE "_TherapeuticClassesOnMedicines" DROP CONSTRAINT "_TherapeuticClassesOnMedicines_B_fkey";

-- DropTable
DROP TABLE "_TherapeuticClassesOnMedicines";
