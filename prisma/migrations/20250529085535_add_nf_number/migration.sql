/*
  Warnings:

  - Added the required column `nf_number` to the `medicines_entries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medicines_entries" ADD COLUMN     "nf_number" TEXT NOT NULL;
