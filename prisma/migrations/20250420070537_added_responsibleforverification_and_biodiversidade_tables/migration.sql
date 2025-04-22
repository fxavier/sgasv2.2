-- AlterTable
ALTER TABLE "_AcceptanceConfirmationToOHSACTING" ADD CONSTRAINT "_AcceptanceConfirmationToOHSACTING_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AcceptanceConfirmationToOHSACTING_AB_unique";

-- AlterTable
ALTER TABLE "_AccoesImediatasECorrectivasToRelatorioAcidenteIncidente" ADD CONSTRAINT "_AccoesImediatasECorrectivasToRelatorioAcidenteIncident_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AccoesImediatasECorrectivasToRelatorioAcidenteIncide_AB_unique";

-- AlterTable
ALTER TABLE "_ComplaintAndClaimRecordToPhotoDocumentProvingClosure" ADD CONSTRAINT "_ComplaintAndClaimRecordToPhotoDocumentProvingClosure_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ComplaintAndClaimRecordToPhotoDocumentProvingClosure_AB_unique";

-- AlterTable
ALTER TABLE "_EnvironAndSocialRiskAndImapactAssessementToLegalRequirementCon" ADD CONSTRAINT "_EnvironAndSocialRiskAndImapactAssessementToLegalRequir_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_EnvironAndSocialRiskAndImapactAssessementToLegalRequ_AB_unique";

-- AlterTable
ALTER TABLE "_IncidentFlashReportToIncidents" ADD CONSTRAINT "_IncidentFlashReportToIncidents_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_IncidentFlashReportToIncidents_AB_unique";

-- AlterTable
ALTER TABLE "_PessoasEnvolvidasNaInvestigacaoToRelatorioAcidenteIncidente" ADD CONSTRAINT "_PessoasEnvolvidasNaInvestigacaoToRelatorioAcidenteInci_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_PessoasEnvolvidasNaInvestigacaoToRelatorioAcidenteIn_AB_unique";

-- CreateTable
CREATE TABLE "responsible_for_verification" (
    "id" TEXT NOT NULL,
    "contactPersonId" TEXT NOT NULL,

    CONSTRAINT "responsible_for_verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biodiversidade_recursos_naturais" (
    "id" TEXT NOT NULL,
    "reference" TEXT,
    "description" TEXT NOT NULL,

    CONSTRAINT "biodiversidade_recursos_naturais_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "responsible_for_verification_contactPersonId_key" ON "responsible_for_verification"("contactPersonId");

-- AddForeignKey
ALTER TABLE "responsible_for_verification" ADD CONSTRAINT "responsible_for_verification_contactPersonId_fkey" FOREIGN KEY ("contactPersonId") REFERENCES "contact_persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
