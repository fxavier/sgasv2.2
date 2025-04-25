/*
  Warnings:

  - Changed the type of `furtherInvestigationRequired` on the `incident_flash_reports` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `incidentReportable` on the `incident_flash_reports` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lendersToBeNotified` on the `incident_flash_reports` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "FurtherInvestigationRequired" AS ENUM ('Yes', 'No');

-- AlterTable
ALTER TABLE "incident_flash_reports" DROP COLUMN "furtherInvestigationRequired",
ADD COLUMN     "furtherInvestigationRequired" "FurtherInvestigationRequired" NOT NULL,
DROP COLUMN "incidentReportable",
ADD COLUMN     "incidentReportable" "FurtherInvestigationRequired" NOT NULL,
DROP COLUMN "lendersToBeNotified",
ADD COLUMN     "lendersToBeNotified" "FurtherInvestigationRequired" NOT NULL;

-- DropEnum
DROP TYPE "FurtherInvestigatioRequired";
