-- AlterEnum
ALTER TYPE "EntryType" ADD VALUE 'INVENTORY';

-- AlterEnum
ALTER TYPE "ExitType" ADD VALUE 'INVENTORY';

-- AlterTable
ALTER TABLE "exits" ADD COLUMN     "reverse_at" TIMESTAMP(3);
