/*
  Warnings:

  - You are about to drop the `Movimentation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Movimentation" DROP CONSTRAINT "Movimentation_batch_stock_id_fkey";

-- DropForeignKey
ALTER TABLE "Movimentation" DROP CONSTRAINT "Movimentation_dispensation_id_fkey";

-- DropForeignKey
ALTER TABLE "Movimentation" DROP CONSTRAINT "Movimentation_entry_id_fkey";

-- DropForeignKey
ALTER TABLE "Movimentation" DROP CONSTRAINT "Movimentation_exit_id_fkey";

-- DropForeignKey
ALTER TABLE "Movimentation" DROP CONSTRAINT "Movimentation_movement_type_id_fkey";

-- DropTable
DROP TABLE "Movimentation";

-- CreateTable
CREATE TABLE "movimentation" (
    "id" TEXT NOT NULL,
    "direction" "MovementDirection" NOT NULL,
    "batch_stock_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "movement_type_id" TEXT,
    "dispensation_id" TEXT,
    "exit_id" TEXT,
    "entry_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "movimentation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "movimentation" ADD CONSTRAINT "movimentation_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "medicines_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentation" ADD CONSTRAINT "movimentation_exit_id_fkey" FOREIGN KEY ("exit_id") REFERENCES "exits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentation" ADD CONSTRAINT "movimentation_dispensation_id_fkey" FOREIGN KEY ("dispensation_id") REFERENCES "dispensations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentation" ADD CONSTRAINT "movimentation_batch_stock_id_fkey" FOREIGN KEY ("batch_stock_id") REFERENCES "batches_stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentation" ADD CONSTRAINT "movimentation_movement_type_id_fkey" FOREIGN KEY ("movement_type_id") REFERENCES "MovementType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
