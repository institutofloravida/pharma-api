/*
  Warnings:

  - You are about to drop the `_OperatorInstitutions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OperatorInstitutions" DROP CONSTRAINT "_OperatorInstitutions_A_fkey";

-- DropForeignKey
ALTER TABLE "_OperatorInstitutions" DROP CONSTRAINT "_OperatorInstitutions_B_fkey";

-- DropTable
DROP TABLE "_OperatorInstitutions";
