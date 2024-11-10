/*
  Warnings:

  - The values [ADMIN] on the enum `OperatorRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OperatorRole_new" AS ENUM ('SUPER_ADMIN', 'MANAGER', 'COMMON');
ALTER TABLE "operators" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "operators" ALTER COLUMN "role" TYPE "OperatorRole_new" USING ("role"::text::"OperatorRole_new");
ALTER TYPE "OperatorRole" RENAME TO "OperatorRole_old";
ALTER TYPE "OperatorRole_new" RENAME TO "OperatorRole";
DROP TYPE "OperatorRole_old";
ALTER TABLE "operators" ALTER COLUMN "role" SET DEFAULT 'COMMON';
COMMIT;
