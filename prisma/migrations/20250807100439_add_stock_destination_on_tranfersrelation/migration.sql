-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_stock_destination_id_fkey" FOREIGN KEY ("stock_destination_id") REFERENCES "stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
