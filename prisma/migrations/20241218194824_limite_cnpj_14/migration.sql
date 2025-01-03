/*
  Warnings:

  - You are about to alter the column `cnpj` on the `manufacturers` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(14)`.

*/
-- AlterTable
ALTER TABLE "manufacturers" ALTER COLUMN "cnpj" SET DATA TYPE VARCHAR(14);
