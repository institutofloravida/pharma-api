/*
  Warnings:

  - You are about to drop the `OperatorsOnInstitutions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OperatorsOnInstitutions" DROP CONSTRAINT "OperatorsOnInstitutions_institutionId_fkey";

-- DropForeignKey
ALTER TABLE "OperatorsOnInstitutions" DROP CONSTRAINT "OperatorsOnInstitutions_operatorId_fkey";

-- DropTable
DROP TABLE "OperatorsOnInstitutions";

-- CreateTable
CREATE TABLE "_OperatorInstitutions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OperatorInstitutions_AB_unique" ON "_OperatorInstitutions"("A", "B");

-- CreateIndex
CREATE INDEX "_OperatorInstitutions_B_index" ON "_OperatorInstitutions"("B");

-- AddForeignKey
ALTER TABLE "_OperatorInstitutions" ADD CONSTRAINT "_OperatorInstitutions_A_fkey" FOREIGN KEY ("A") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OperatorInstitutions" ADD CONSTRAINT "_OperatorInstitutions_B_fkey" FOREIGN KEY ("B") REFERENCES "operators"("id") ON DELETE CASCADE ON UPDATE CASCADE;
