-- AddForeignKey
ALTER TABLE "MedicineEntry" ADD CONSTRAINT "MedicineEntry_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "operators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
