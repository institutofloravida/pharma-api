-- AlterEnum
ALTER TYPE "ExitType" ADD VALUE 'DONATION';

-- AlterTable
ALTER TABLE "exits" ADD COLUMN     "destination_institution_id" TEXT;

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_destination_institution_id_fkey" FOREIGN KEY ("destination_institution_id") REFERENCES "institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
