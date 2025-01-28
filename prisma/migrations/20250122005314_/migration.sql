/*
  Warnings:

  - You are about to drop the column `pathologiesIds` on the `patients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "patients" DROP COLUMN "pathologiesIds";

-- CreateTable
CREATE TABLE "_PathologyToPatient" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PathologyToPatient_AB_unique" ON "_PathologyToPatient"("A", "B");

-- CreateIndex
CREATE INDEX "_PathologyToPatient_B_index" ON "_PathologyToPatient"("B");

-- AddForeignKey
ALTER TABLE "_PathologyToPatient" ADD CONSTRAINT "_PathologyToPatient_A_fkey" FOREIGN KEY ("A") REFERENCES "pathology"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PathologyToPatient" ADD CONSTRAINT "_PathologyToPatient_B_fkey" FOREIGN KEY ("B") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
