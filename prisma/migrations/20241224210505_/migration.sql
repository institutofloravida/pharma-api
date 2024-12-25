/*
  Warnings:

  - The values [black,white,yellow,mixed,undeclared,indigenous] on the enum `Race` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Race_new" AS ENUM ('BLACK', 'WHITE', 'YELLOW', 'MIXED', 'UNDECLRARED', 'INDIGENOUS');
ALTER TABLE "patients" ALTER COLUMN "race" TYPE "Race_new" USING ("race"::text::"Race_new");
ALTER TYPE "Race" RENAME TO "Race_old";
ALTER TYPE "Race_new" RENAME TO "Race";
DROP TYPE "Race_old";
COMMIT;
