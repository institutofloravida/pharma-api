/*
  Warnings:

  - The values [OTHER] on the enum `ExitType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExitType_new" AS ENUM ('DISPENSATION', 'MOVEMENT_TYPE', 'EXPIRATION');
ALTER TABLE "exits" ALTER COLUMN "exitType" TYPE "ExitType_new" USING ("exitType"::text::"ExitType_new");
ALTER TYPE "ExitType" RENAME TO "ExitType_old";
ALTER TYPE "ExitType_new" RENAME TO "ExitType";
DROP TYPE "ExitType_old";
COMMIT;

-- AlterTable
ALTER TABLE "exits" ADD COLUMN     "movementTypeId" TEXT;

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_movementTypeId_fkey" FOREIGN KEY ("movementTypeId") REFERENCES "MovementType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
