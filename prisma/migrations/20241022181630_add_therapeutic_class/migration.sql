-- CreateTable
CREATE TABLE "therapeutic_classes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "therapeutic_classes_pkey" PRIMARY KEY ("id")
);
