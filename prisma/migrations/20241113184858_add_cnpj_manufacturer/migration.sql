/*
  Warnings:

  - Added the required column `cnpj` to the `manufacturers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "manufacturers" ADD COLUMN     "cnpj" TEXT NOT NULL;
