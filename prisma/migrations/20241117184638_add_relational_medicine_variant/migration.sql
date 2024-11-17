-- AddForeignKey
ALTER TABLE "medicine_variants" ADD CONSTRAINT "medicine_variants_pharmaceutical_form_id_fkey" FOREIGN KEY ("pharmaceutical_form_id") REFERENCES "pharmaceutical_forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_variants" ADD CONSTRAINT "medicine_variants_unit_measure_id_fkey" FOREIGN KEY ("unit_measure_id") REFERENCES "unit_measures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
