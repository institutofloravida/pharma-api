/*
  Warnings:

  - Made the column `institution_id` on table `stocks` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_institution_id_fkey";

-- AlterTable
ALTER TABLE "stocks" ALTER COLUMN "institution_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
