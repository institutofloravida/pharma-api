-- CreateTable
CREATE TABLE "OperatorsOnInstitutions" (
    "operatorId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,

    CONSTRAINT "OperatorsOnInstitutions_pkey" PRIMARY KEY ("operatorId","institutionId")
);

-- AddForeignKey
ALTER TABLE "OperatorsOnInstitutions" ADD CONSTRAINT "OperatorsOnInstitutions_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "operators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperatorsOnInstitutions" ADD CONSTRAINT "OperatorsOnInstitutions_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
