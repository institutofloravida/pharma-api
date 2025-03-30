/*
  Warnings:

  - A unique constraint covering the columns `[manufacturer_id,code]` on the table `batches` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "batches_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "batches_manufacturer_id_code_key" ON "batches"("manufacturer_id", "code");
