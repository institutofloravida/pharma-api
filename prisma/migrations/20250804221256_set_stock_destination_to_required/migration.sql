/*
  Warnings:

  - Made the column `stock_destination_id` on table `transfers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "transfers" ALTER COLUMN "stock_destination_id" SET NOT NULL;
