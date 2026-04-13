-- AlterEnum
ALTER TYPE "EntryType" ADD VALUE 'CORRECTION';

-- AlterTable
ALTER TABLE "medicines_entries" ADD COLUMN     "corrected_at" TIMESTAMP(3),
ADD COLUMN     "correction_of_entry_id" TEXT;

-- AlterTable
ALTER TABLE "movimentation" ADD COLUMN     "correction_entry_id" TEXT;

-- AddForeignKey
ALTER TABLE "movimentation" ADD CONSTRAINT "movimentation_correction_entry_id_fkey" FOREIGN KEY ("correction_entry_id") REFERENCES "medicines_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicines_entries" ADD CONSTRAINT "medicines_entries_correction_of_entry_id_fkey" FOREIGN KEY ("correction_of_entry_id") REFERENCES "medicines_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
