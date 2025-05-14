-- AlterTable
ALTER TABLE "_ClassMedicines" ADD CONSTRAINT "_ClassMedicines_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ClassMedicines_AB_unique";

-- AlterTable
ALTER TABLE "_OperatorInstitutions" ADD CONSTRAINT "_OperatorInstitutions_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_OperatorInstitutions_AB_unique";

-- AlterTable
ALTER TABLE "_PathologyToPatient" ADD CONSTRAINT "_PathologyToPatient_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_PathologyToPatient_AB_unique";

-- AlterTable
ALTER TABLE "patients" ALTER COLUMN "cpf" DROP NOT NULL;
