/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `institutions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "institutions_cnpj_key" ON "institutions"("cnpj");
