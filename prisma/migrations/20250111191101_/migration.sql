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
