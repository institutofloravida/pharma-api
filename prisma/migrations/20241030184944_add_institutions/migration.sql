/*
  Warnings:

  - You are about to drop the column `createdAt` on the `operators` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `operators` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `operators` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `therapeutic_classes` table. All the data in the column will be lost.
  - Added the required column `password_hash` to the `operators` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "operators" DROP COLUMN "createdAt",
DROP COLUMN "passwordHash",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "therapeutic_classes" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "institutions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "institutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OperatorInstitutions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OperatorInstitutions_AB_unique" ON "_OperatorInstitutions"("A", "B");

-- CreateIndex
CREATE INDEX "_OperatorInstitutions_B_index" ON "_OperatorInstitutions"("B");

-- AddForeignKey
ALTER TABLE "_OperatorInstitutions" ADD CONSTRAINT "_OperatorInstitutions_A_fkey" FOREIGN KEY ("A") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OperatorInstitutions" ADD CONSTRAINT "_OperatorInstitutions_B_fkey" FOREIGN KEY ("B") REFERENCES "operators"("id") ON DELETE CASCADE ON UPDATE CASCADE;
