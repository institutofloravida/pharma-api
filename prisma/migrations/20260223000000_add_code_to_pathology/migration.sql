-- AlterTable
ALTER TABLE "pathology" ADD COLUMN "code" TEXT;

-- Update existing rows with a unique placeholder so NOT NULL constraint can be added
UPDATE "pathology" SET "code" = id WHERE "code" IS NULL;

-- Set NOT NULL
ALTER TABLE "pathology" ALTER COLUMN "code" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "pathology_code_key" ON "pathology"("code");

-- CreateIndex
CREATE INDEX "pathology_code_idx" ON "pathology"("code");
