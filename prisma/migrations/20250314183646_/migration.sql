/*
  Warnings:

  - A unique constraint covering the columns `[adress_id]` on the table `patients` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "patients_adress_id_key" ON "patients"("adress_id");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_adress_id_fkey" FOREIGN KEY ("adress_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
