-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_adress_id_fkey";

-- AlterTable
ALTER TABLE "patients" ALTER COLUMN "adress_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_adress_id_fkey" FOREIGN KEY ("adress_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
