/*
  Warnings:

  - Added the required column `control_stock` to the `institutions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responsible` to the `institutions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `institutions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InstitutionType" AS ENUM ('PUBLIC', 'PRIVATE', 'ONG');

-- AlterTable
ALTER TABLE "institutions" ADD COLUMN     "control_stock" BOOLEAN NOT NULL,
ADD COLUMN     "responsible" TEXT NOT NULL,
ADD COLUMN     "type" "InstitutionType" NOT NULL;
