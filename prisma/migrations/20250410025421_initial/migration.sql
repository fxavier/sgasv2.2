-- CreateEnum
CREATE TYPE "DocumentState" AS ENUM ('REVISION', 'INUSE', 'OBSOLETE');

-- CreateEnum
CREATE TYPE "Duration" AS ENUM ('CURTO_PRAZO', 'MEDIO_PRAZO', 'LONGO_PRAZO');

-- CreateEnum
CREATE TYPE "Extension" AS ENUM ('LOCAL', 'REGIONAL', 'NACIONAL', 'GLOBAL');

-- CreateEnum
CREATE TYPE "Intensity" AS ENUM ('BAIXA', 'MEDIA', 'ALTA');

-- CreateEnum
CREATE TYPE "LifeCycle" AS ENUM ('PRE_CONSTRUCAO', 'CONSTRUCAO', 'OPERACAO', 'DESATIVACAO', 'ENCERRAMENTO', 'REINTEGRACAO_RESTAURACAO');

-- CreateEnum
CREATE TYPE "Probability" AS ENUM ('IMPROVAVEL', 'PROVAVEL', 'ALTAMENTE_PROVAVEL', 'DEFINITIVA');

-- CreateEnum
CREATE TYPE "ResponseType" AS ENUM ('SIM', 'NAO');

-- CreateEnum
CREATE TYPE "Statute" AS ENUM ('POSITIVO', 'NEGATIVO');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'REVOKED', 'AMENDED');

-- CreateEnum
CREATE TYPE "TrainingType" AS ENUM ('Internal', 'External');

-- CreateEnum
CREATE TYPE "TrainingMonth" AS ENUM ('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

-- CreateEnum
CREATE TYPE "TrainingStatus" AS ENUM ('Planned', 'Completed');

-- CreateEnum
CREATE TYPE "AnswerChoices" AS ENUM ('Satisfactory', 'Partially_Satisfactory', 'Unsatisfactory');

-- CreateEnum
CREATE TYPE "HumanResourceAnswerChoices" AS ENUM ('effective', 'ineffective');

-- CreateEnum
CREATE TYPE "Effectiveness" AS ENUM ('Effective', 'Not_effective');

-- CreateEnum
CREATE TYPE "TipoIncidente" AS ENUM ('Humano', 'Seguranca', 'Infraestruturas', 'Ambiental', 'Social', 'Outros');

-- CreateEnum
CREATE TYPE "EnvoldidoOutroAcidente" AS ENUM ('Sim', 'Nao');

-- CreateEnum
CREATE TYPE "RealizadaAnaliseRiscoImpactoAmbientalAntes" AS ENUM ('Sim', 'Nao');

-- CreateEnum
CREATE TYPE "ExisteProcedimentoParaActividade" AS ENUM ('Sim', 'Nao');

-- CreateEnum
CREATE TYPE "ColaboradorRecebeuTreinamento" AS ENUM ('Sim', 'Nao');

-- CreateEnum
CREATE TYPE "NaturezaEExtensaoIncidente" AS ENUM ('Intoxicacao_leve', 'Intoxicacao_grave', 'Ferimento_leve', 'Ferimento_grave', 'Morte', 'Nenhum', 'Outros');

-- CreateEnum
CREATE TYPE "PossiveisCausasAcidenteMetodologia" AS ENUM ('Falta_de_procedimentos_para_actividade', 'Falhas_no_procedimento_existente', 'Falta_de_plano_de_trabalho', 'Falha_na_comunicacao', 'Outros');

-- CreateEnum
CREATE TYPE "PossiveisCausasAcidenteEquipamentos" AS ENUM ('Falha_de_equipamento', 'Equipamento_inapropriado', 'Falha_na_proteccao_do_equipamento', 'Falha_na_sinalizacao', 'Espaco_inapropriado_para_equipamento', 'Outros');

-- CreateEnum
CREATE TYPE "PossiveisCausasAcidenteMaterial" AS ENUM ('Ferramenta_defeituosa', 'Falha_na_ferramenta', 'Falta_de_inventario', 'EPI_inadequado', 'Outros');

-- CreateEnum
CREATE TYPE "PossiveisCausasAcidenteColaboradores" AS ENUM ('Falta_de_treinamento', 'Negligencia_do_colaborador', 'Negligencia_do_operador_sazonal', 'Nao_concardancia_com_procedimentos', 'Uso_inadequado_de_equipamento', 'Outros');

-- CreateEnum
CREATE TYPE "PossiveisCausasAcidenteAmbienteESeguranca" AS ENUM ('Agentes_perigosos', 'Falta_de_sinalizacao', 'Pavimento_irregular', 'Pavimento_escorregadio', 'Outros');

-- CreateEnum
CREATE TYPE "PossiveisCausasAcidenteMedicoes" AS ENUM ('Falta_no_instrumento_de_medicao', 'Instrumento_de_ajustamento_inadequado', 'Falha_no_instrumento_de_calibracao', 'Falta_de_inspencao', 'Outros');

-- CreateEnum
CREATE TYPE "ObrasForamSuspensas" AS ENUM ('Sim', 'Nao');

-- CreateEnum
CREATE TYPE "IncidenteEnvolveuEmpreteiro" AS ENUM ('Sim', 'Nao');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('Employee', 'Subcontrator');

-- CreateEnum
CREATE TYPE "FurtherInvestigatioRequired" AS ENUM ('Yes', 'No');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "EfecctivivenessEvaluation" AS ENUM ('EFFECTIVE', 'NOT_EFFECTIVE');

-- CreateEnum
CREATE TYPE "NotifiedComplaint" AS ENUM ('YES', 'NO');

-- CreateEnum
CREATE TYPE "ComplaintantGender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "AnonymousComplaint" AS ENUM ('YES', 'NO');

-- CreateEnum
CREATE TYPE "ComplaintantAccepted" AS ENUM ('YES', 'NO');

-- CreateEnum
CREATE TYPE "ClaimCategory" AS ENUM ('Odor', 'Noise', 'Effluents', 'Company_vehicles', 'Flow_of_migrant_workers', 'Security_personnel', 'GBV_SA_SEA', 'Other');

-- CreateEnum
CREATE TYPE "CollectedInformation" AS ENUM ('Photos', 'Proof_of_legitimacy_documents');

-- CreateEnum
CREATE TYPE "ResolutionType" AS ENUM ('Internal_resolution', 'Second_level_resolution', 'Third_level_resolution');

-- CreateEnum
CREATE TYPE "ResolutionSubmitted" AS ENUM ('YES', 'NO');

-- CreateEnum
CREATE TYPE "ComplaintantSatisfaction" AS ENUM ('SATISFIED', 'NOT_SATISFIED');

-- CreateEnum
CREATE TYPE "MonitoringAfterClosure" AS ENUM ('YES', 'NO');

-- CreateEnum
CREATE TYPE "PreferedContactMethod" AS ENUM ('EMAIL', 'PHONE', 'FACE_TO_FACE');

-- CreateEnum
CREATE TYPE "PreferedLanguage" AS ENUM ('PORTUGUESE', 'ENGLISH', 'OTHER');

-- CreateEnum
CREATE TYPE "Provinces" AS ENUM ('MAPUTO', 'MAPUTO_CITY', 'GAZA', 'INHAMBANE', 'SOFALA', 'MANICA', 'TETE', 'ZAMBEZIA', 'NAMPULA', 'CABO_DELGADO', 'NIASSA');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('TURISTICA', 'INDUSTRIAL', 'AGRO_PECUARIA', 'ENERGETICA', 'SERVICOS', 'OUTRA');

-- CreateEnum
CREATE TYPE "DevelopmentStage" AS ENUM ('NOVA', 'REABILITACAO', 'EXPANSAO', 'OUTRO');

-- CreateEnum
CREATE TYPE "InsertionPoint" AS ENUM ('RURAL', 'URBANO', 'PERIURBANO');

-- CreateEnum
CREATE TYPE "TerritorialPlanningFramework" AS ENUM ('ESPACO_HABITACIONAL', 'INDUSTRIAL', 'SERVICOS', 'OUTRO');

-- CreateEnum
CREATE TYPE "PyhsicalCharacteristics" AS ENUM ('PLANICIE', 'PLANALTO', 'VALE', 'MONTANHA');

-- CreateEnum
CREATE TYPE "PredominantEcosystems" AS ENUM ('FLUVIAL', 'LACUSTRE', 'MARINHO', 'TERRESTRE');

-- CreateEnum
CREATE TYPE "LocationZone" AS ENUM ('COSTEIRA', 'INTERIOR', 'ILHA');

-- CreateEnum
CREATE TYPE "TypeOfPredominantVegetation" AS ENUM ('FLORESTA', 'SAVANA', 'OUTRO');

-- CreateEnum
CREATE TYPE "LandUse" AS ENUM ('AGROPECUARIO', 'HABITACIONAL', 'INDUSTRIAL', 'PROTECCAO', 'OUTRO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_types" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "document_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "revisionDate" TIMESTAMP(3) NOT NULL,
    "documentName" TEXT NOT NULL,
    "documentTypeId" TEXT NOT NULL,
    "documentPath" TEXT NOT NULL,
    "documentState" "DocumentState" NOT NULL,
    "retentionPeriod" TIMESTAMP(3) NOT NULL,
    "disposalMethod" TEXT NOT NULL,
    "observation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strategic_objectives" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "goals" TEXT NOT NULL,
    "strategiesForAchievement" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "strategic_objectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specific_objectives" (
    "id" TEXT NOT NULL,
    "strategicObjectiveId" TEXT NOT NULL,
    "specificObjective" TEXT NOT NULL,
    "actionsForAchievement" TEXT NOT NULL,
    "responsiblePerson" TEXT NOT NULL,
    "necessaryResources" TEXT NOT NULL,
    "indicator" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "monitoringFrequency" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "observation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "specific_objectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waste_transfer_logs" (
    "id" TEXT NOT NULL,
    "wasteType" TEXT NOT NULL,
    "howIsWasteContained" TEXT NOT NULL,
    "howMuchWaste" INTEGER NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "dateOfRemoval" TIMESTAMP(3) NOT NULL,
    "transferCompany" TEXT NOT NULL,
    "specialInstructions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "waste_transfer_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waste_management" (
    "id" TEXT NOT NULL,
    "wasteRoute" TEXT NOT NULL,
    "labelling" TEXT NOT NULL,
    "storage" TEXT NOT NULL,
    "transportationCompanyMethod" TEXT NOT NULL,
    "disposalCompany" TEXT NOT NULL,
    "specialInstructions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "waste_management_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subprojects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contractReference" TEXT,
    "contractorName" TEXT,
    "estimatedCost" DECIMAL(65,30),
    "location" TEXT NOT NULL,
    "geographicCoordinates" TEXT,
    "type" TEXT NOT NULL,
    "approximateArea" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subprojects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "environmental_factors" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "environmental_factors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risks_and_impacts" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "risks_and_impacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legal_requirement_controls" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "documentTitle" TEXT NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "amendedDescription" TEXT,
    "observation" TEXT,
    "lawFile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "legal_requirement_controls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "environ_and_social_risk_assessments" (
    "id" TEXT NOT NULL,
    "departmentId" TEXT,
    "subprojectId" TEXT,
    "activity" TEXT NOT NULL,
    "risksAndImpactId" TEXT NOT NULL,
    "environmentalFactorId" TEXT NOT NULL,
    "lifeCycle" "LifeCycle" NOT NULL,
    "statute" "Statute" NOT NULL,
    "extension" "Extension" NOT NULL,
    "duration" "Duration" NOT NULL,
    "intensity" "Intensity" NOT NULL,
    "probability" "Probability" NOT NULL,
    "significance" TEXT,
    "descriptionOfMeasures" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "responsible" TEXT,
    "effectivenessAssessment" TEXT NOT NULL,
    "complianceRequirements" TEXT NOT NULL,
    "observations" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "environ_and_social_risk_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_needs" (
    "id" TEXT NOT NULL,
    "filledBy" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "departmentId" TEXT,
    "subprojectId" TEXT,
    "training" TEXT NOT NULL,
    "trainingObjective" TEXT NOT NULL,
    "proposalOfTrainingEntity" TEXT NOT NULL,
    "potentialTrainingParticipants" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_needs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_plans" (
    "id" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "year" INTEGER NOT NULL,
    "trainingArea" TEXT NOT NULL,
    "trainingTitle" TEXT NOT NULL,
    "trainingObjective" TEXT NOT NULL,
    "trainingType" "TrainingType" NOT NULL,
    "trainingEntity" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "numberOfTrainees" INTEGER NOT NULL,
    "trainingRecipients" TEXT NOT NULL,
    "trainingMonth" "TrainingMonth" NOT NULL,
    "trainingStatus" "TrainingStatus" NOT NULL,
    "observations" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_evaluation_questions" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_evaluation_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_effectiveness_assessments" (
    "id" TEXT NOT NULL,
    "training" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "departmentId" TEXT,
    "subprojectId" TEXT,
    "trainee" TEXT NOT NULL,
    "immediateSupervisor" TEXT NOT NULL,
    "trainingEvaluationQuestionId" TEXT NOT NULL,
    "answer" "AnswerChoices" NOT NULL,
    "humanResourceEvaluation" "HumanResourceAnswerChoices" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_effectiveness_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "toolbox_talks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "toolbox_talks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_matrix" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "positionId" TEXT NOT NULL,
    "trainingId" TEXT NOT NULL,
    "toolboxTalksId" TEXT NOT NULL,
    "effectiveness" "Effectiveness" NOT NULL,
    "actionsTrainingNotEffective" TEXT,
    "approvedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_matrix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acceptance_confirmations" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "acceptance_confirmations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ohs_acting" (
    "id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "designation" TEXT,
    "termsOfOfficeFrom" TEXT,
    "termsOfOfficeTo" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ohs_acting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pessoas_envolvidas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "departamentoId" TEXT NOT NULL,
    "outrasInformacoes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pessoas_envolvidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pessoas_envolvidas_na_investigacao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "actividade" TEXT NOT NULL,
    "assinatura" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pessoas_envolvidas_na_investigacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accoes_imediatas_e_correctivas" (
    "id" TEXT NOT NULL,
    "accao" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "assinatura" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accoes_imediatas_e_correctivas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relatorio_acidente_incidente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "funcao" TEXT NOT NULL,
    "departamentoId" TEXT,
    "subprojectoId" TEXT,
    "data" TIMESTAMP(3) NOT NULL,
    "hora" TIMESTAMP(3) NOT NULL,
    "local" TEXT NOT NULL,
    "actividadeEmCurso" TEXT NOT NULL,
    "descricaoDoAcidente" TEXT NOT NULL,
    "tipoDeIncidente" "TipoIncidente" NOT NULL,
    "equipamentoEnvolvido" TEXT NOT NULL,
    "observacao" TEXT NOT NULL,
    "colaboradorEnvolvidoOutroAcidenteAntes" "EnvoldidoOutroAcidente" NOT NULL,
    "realizadaAnaliseRiscoImpactoAmbientalAntes" "RealizadaAnaliseRiscoImpactoAmbientalAntes" NOT NULL,
    "existeProcedimentoParaActividade" "ExisteProcedimentoParaActividade" NOT NULL,
    "colaboradorRecebeuTreinamento" "ColaboradorRecebeuTreinamento" NOT NULL,
    "incidenteEnvolveEmpreteiro" "IncidenteEnvolveuEmpreteiro" NOT NULL,
    "nomeComercialEmpreteiro" TEXT,
    "naturezaEExtensaoIncidente" "NaturezaEExtensaoIncidente" NOT NULL,
    "possiveisCausasAcidenteMetodologia" "PossiveisCausasAcidenteMetodologia" NOT NULL,
    "possiveisCausasAcidenteEquipamentos" "PossiveisCausasAcidenteEquipamentos" NOT NULL,
    "possiveisCausasAcidenteMaterial" "PossiveisCausasAcidenteMaterial" NOT NULL,
    "possiveisCausasAcidenteColaboradores" "PossiveisCausasAcidenteColaboradores" NOT NULL,
    "possiveisCausasAcidenteAmbienteESeguranca" "PossiveisCausasAcidenteAmbienteESeguranca" NOT NULL,
    "possiveisCausasAcidenteMedicoes" "PossiveisCausasAcidenteMedicoes" NOT NULL,
    "pessoaEnvolvidaId" TEXT NOT NULL,
    "fotografiaFrontal" TEXT,
    "fotografiaPosterior" TEXT,
    "fotografiaLateralDireita" TEXT,
    "fotografiaLateralEsquerda" TEXT,
    "fotografiaDoMelhorAngulo" TEXT,
    "fotografia" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "relatorio_acidente_incidente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lista_verificacao_kit_primeiros_socorros" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "prazo" TIMESTAMP(3) NOT NULL,
    "observacao" TEXT NOT NULL,
    "inspecaoRealizadaPor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lista_verificacao_kit_primeiros_socorros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidents" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incident_flash_reports" (
    "id" TEXT NOT NULL,
    "dateIncident" TIMESTAMP(3) NOT NULL,
    "timeIncident" TIMESTAMP(3) NOT NULL,
    "section" TEXT,
    "locationIncident" TEXT NOT NULL,
    "dateReported" TIMESTAMP(3) NOT NULL,
    "supervisor" TEXT NOT NULL,
    "type" "Type" NOT NULL,
    "employeeName" TEXT,
    "subcontratorName" TEXT,
    "incidentDescription" TEXT NOT NULL,
    "detailsOfInjuredPerson" TEXT NOT NULL,
    "witnessStatement" TEXT,
    "preliminaryFindings" TEXT,
    "recomendations" TEXT NOT NULL,
    "furtherInvestigationRequired" "FurtherInvestigatioRequired" NOT NULL,
    "incidentReportable" "FurtherInvestigatioRequired" NOT NULL,
    "lendersToBeNotified" "FurtherInvestigatioRequired" NOT NULL,
    "authorOfReport" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approverName" TEXT NOT NULL,
    "dateApproved" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incident_flash_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_non_compliance_control" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "departmentId" TEXT,
    "subprojectId" TEXT,
    "nonComplianceDescription" TEXT NOT NULL,
    "identifiedCauses" TEXT NOT NULL,
    "correctiveActions" TEXT NOT NULL,
    "responsiblePerson" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "ClaimStatus" NOT NULL DEFAULT 'PENDING',
    "effectivenessEvaluation" "EfecctivivenessEvaluation" NOT NULL DEFAULT 'NOT_EFFECTIVE',
    "responsiblePersonEvaluation" TEXT NOT NULL,
    "observation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "claim_non_compliance_control_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_complain_control" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "claimComplainSubmittedBy" TEXT NOT NULL,
    "claimComplainReceptionDate" TIMESTAMP(3) NOT NULL,
    "claimComplainDescription" TEXT NOT NULL,
    "treatmentAction" TEXT NOT NULL,
    "claimComplainResponsiblePerson" TEXT NOT NULL,
    "claimComplainDeadline" TIMESTAMP(3) NOT NULL,
    "claimComplainStatus" "ClaimStatus" NOT NULL DEFAULT 'PENDING',
    "closureDate" TIMESTAMP(3) NOT NULL,
    "observation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "claim_complain_control_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photo_document_proving_closure" (
    "id" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "photo_document_proving_closure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaint_and_claim_record" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "dateOccurred" TIMESTAMP(3) NOT NULL,
    "localOccurrence" TEXT NOT NULL,
    "howOccurred" TEXT NOT NULL,
    "whoInvolved" TEXT NOT NULL,
    "reportAndExplanation" TEXT NOT NULL,
    "registeredDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimLocalOccurrence" TEXT NOT NULL,
    "complaintantGender" "ComplaintantGender" NOT NULL,
    "complaintantAge" INTEGER NOT NULL,
    "anonymousComplaint" "AnonymousComplaint" NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT,
    "complaintantAddress" TEXT NOT NULL,
    "complaintantAccepted" "ComplaintantAccepted" NOT NULL,
    "actionTaken" TEXT NOT NULL,
    "complaintantNotified" "NotifiedComplaint" NOT NULL DEFAULT 'NO',
    "notificationMethod" TEXT NOT NULL,
    "closingDate" TIMESTAMP(3) NOT NULL,
    "claimCategory" "ClaimCategory" NOT NULL,
    "otherClaimCategory" TEXT NOT NULL,
    "inspectionDate" TIMESTAMP(3) NOT NULL,
    "collectedInformation" "CollectedInformation" NOT NULL,
    "resolutionType" "ResolutionType" NOT NULL,
    "resolutionDate" TIMESTAMP(3) NOT NULL,
    "resolutionSubmitted" "ResolutionSubmitted" NOT NULL,
    "correctiveActionTaken" TEXT NOT NULL,
    "involvedInResolution" TEXT NOT NULL,
    "complaintantSatisfaction" "ComplaintantSatisfaction" NOT NULL,
    "resourcesSpent" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "numberOfDaysSinceReceivedToClosure" INTEGER NOT NULL,
    "monitoringAfterClosure" "MonitoringAfterClosure" NOT NULL,
    "monitoringMethodAndFrequency" TEXT NOT NULL,
    "followUp" TEXT NOT NULL,
    "involvedInstitutions" TEXT,
    "suggestedPreventiveActions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "complaint_and_claim_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_grievances" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "preferedContactMethod" "PreferedContactMethod" NOT NULL,
    "contact" TEXT NOT NULL,
    "preferedLanguage" "PreferedLanguage" NOT NULL,
    "otherLanguage" TEXT,
    "grievanceDetails" TEXT NOT NULL,
    "uniqueIdentificationOfCompanyAcknowlegement" TEXT NOT NULL,
    "nameOfPersonAcknowledgingGrievance" TEXT NOT NULL,
    "positionOfPersonAcknowledgingGrievance" TEXT NOT NULL,
    "dateOfAcknowledgement" TIMESTAMP(3) NOT NULL,
    "signatureOfPersonAcknowledgingGrievance" TEXT NOT NULL,
    "followUpDetails" TEXT NOT NULL,
    "closedOutDate" TIMESTAMP(3) NOT NULL,
    "signatureOfResponseCorrectiveActionPerson" TEXT NOT NULL,
    "acknowledgeReceiptOfResponse" TEXT NOT NULL,
    "nameOfPersonAcknowledgingResponse" TEXT NOT NULL,
    "signatureOfPersonAcknowledgingResponse" TEXT NOT NULL,
    "dateOfAcknowledgementResponse" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "worker_grievances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_persons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "signature" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsible_for_filling_forms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "signature" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "responsible_for_filling_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screening_results" (
    "id" TEXT NOT NULL,
    "subprojectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "screening_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultation_and_engagement" (
    "id" TEXT NOT NULL,
    "subprojectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultation_and_engagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "environmental_social_screening" (
    "id" TEXT NOT NULL,
    "subprojectId" TEXT NOT NULL,
    "responsibleForFillingFormId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "environmental_social_screening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EnvironAndSocialRiskAndImapactAssessementToLegalRequirementCon" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AcceptanceConfirmationToOHSACTING" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PessoasEnvolvidasNaInvestigacaoToRelatorioAcidenteIncidente" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AccoesImediatasECorrectivasToRelatorioAcidenteIncidente" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_IncidentFlashReportToIncidents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ComplaintAndClaimRecordToPhotoDocumentProvingClosure" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "claim_non_compliance_control_number_key" ON "claim_non_compliance_control"("number");

-- CreateIndex
CREATE UNIQUE INDEX "claim_complain_control_number_key" ON "claim_complain_control"("number");

-- CreateIndex
CREATE UNIQUE INDEX "complaint_and_claim_record_number_key" ON "complaint_and_claim_record"("number");

-- CreateIndex
CREATE UNIQUE INDEX "_EnvironAndSocialRiskAndImapactAssessementToLegalRequ_AB_unique" ON "_EnvironAndSocialRiskAndImapactAssessementToLegalRequirementCon"("A", "B");

-- CreateIndex
CREATE INDEX "_EnvironAndSocialRiskAndImapactAssessementToLegalRequir_B_index" ON "_EnvironAndSocialRiskAndImapactAssessementToLegalRequirementCon"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AcceptanceConfirmationToOHSACTING_AB_unique" ON "_AcceptanceConfirmationToOHSACTING"("A", "B");

-- CreateIndex
CREATE INDEX "_AcceptanceConfirmationToOHSACTING_B_index" ON "_AcceptanceConfirmationToOHSACTING"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PessoasEnvolvidasNaInvestigacaoToRelatorioAcidenteIn_AB_unique" ON "_PessoasEnvolvidasNaInvestigacaoToRelatorioAcidenteIncidente"("A", "B");

-- CreateIndex
CREATE INDEX "_PessoasEnvolvidasNaInvestigacaoToRelatorioAcidenteInci_B_index" ON "_PessoasEnvolvidasNaInvestigacaoToRelatorioAcidenteIncidente"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AccoesImediatasECorrectivasToRelatorioAcidenteIncide_AB_unique" ON "_AccoesImediatasECorrectivasToRelatorioAcidenteIncidente"("A", "B");

-- CreateIndex
CREATE INDEX "_AccoesImediatasECorrectivasToRelatorioAcidenteIncident_B_index" ON "_AccoesImediatasECorrectivasToRelatorioAcidenteIncidente"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_IncidentFlashReportToIncidents_AB_unique" ON "_IncidentFlashReportToIncidents"("A", "B");

-- CreateIndex
CREATE INDEX "_IncidentFlashReportToIncidents_B_index" ON "_IncidentFlashReportToIncidents"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ComplaintAndClaimRecordToPhotoDocumentProvingClosure_AB_unique" ON "_ComplaintAndClaimRecordToPhotoDocumentProvingClosure"("A", "B");

-- CreateIndex
CREATE INDEX "_ComplaintAndClaimRecordToPhotoDocumentProvingClosure_B_index" ON "_ComplaintAndClaimRecordToPhotoDocumentProvingClosure"("B");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_documentTypeId_fkey" FOREIGN KEY ("documentTypeId") REFERENCES "document_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specific_objectives" ADD CONSTRAINT "specific_objectives_strategicObjectiveId_fkey" FOREIGN KEY ("strategicObjectiveId") REFERENCES "strategic_objectives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environ_and_social_risk_assessments" ADD CONSTRAINT "environ_and_social_risk_assessments_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environ_and_social_risk_assessments" ADD CONSTRAINT "environ_and_social_risk_assessments_subprojectId_fkey" FOREIGN KEY ("subprojectId") REFERENCES "subprojects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environ_and_social_risk_assessments" ADD CONSTRAINT "environ_and_social_risk_assessments_risksAndImpactId_fkey" FOREIGN KEY ("risksAndImpactId") REFERENCES "risks_and_impacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environ_and_social_risk_assessments" ADD CONSTRAINT "environ_and_social_risk_assessments_environmentalFactorId_fkey" FOREIGN KEY ("environmentalFactorId") REFERENCES "environmental_factors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_needs" ADD CONSTRAINT "training_needs_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_needs" ADD CONSTRAINT "training_needs_subprojectId_fkey" FOREIGN KEY ("subprojectId") REFERENCES "subprojects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_effectiveness_assessments" ADD CONSTRAINT "training_effectiveness_assessments_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_effectiveness_assessments" ADD CONSTRAINT "training_effectiveness_assessments_subprojectId_fkey" FOREIGN KEY ("subprojectId") REFERENCES "subprojects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_effectiveness_assessments" ADD CONSTRAINT "training_effectiveness_assessments_trainingEvaluationQuest_fkey" FOREIGN KEY ("trainingEvaluationQuestionId") REFERENCES "training_evaluation_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_matrix" ADD CONSTRAINT "training_matrix_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_matrix" ADD CONSTRAINT "training_matrix_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "trainings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_matrix" ADD CONSTRAINT "training_matrix_toolboxTalksId_fkey" FOREIGN KEY ("toolboxTalksId") REFERENCES "toolbox_talks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoas_envolvidas" ADD CONSTRAINT "pessoas_envolvidas_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_acidente_incidente" ADD CONSTRAINT "relatorio_acidente_incidente_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_acidente_incidente" ADD CONSTRAINT "relatorio_acidente_incidente_subprojectoId_fkey" FOREIGN KEY ("subprojectoId") REFERENCES "subprojects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_acidente_incidente" ADD CONSTRAINT "relatorio_acidente_incidente_pessoaEnvolvidaId_fkey" FOREIGN KEY ("pessoaEnvolvidaId") REFERENCES "pessoas_envolvidas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_non_compliance_control" ADD CONSTRAINT "claim_non_compliance_control_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_non_compliance_control" ADD CONSTRAINT "claim_non_compliance_control_subprojectId_fkey" FOREIGN KEY ("subprojectId") REFERENCES "subprojects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "screening_results" ADD CONSTRAINT "screening_results_subprojectId_fkey" FOREIGN KEY ("subprojectId") REFERENCES "subprojects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultation_and_engagement" ADD CONSTRAINT "consultation_and_engagement_subprojectId_fkey" FOREIGN KEY ("subprojectId") REFERENCES "subprojects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environmental_social_screening" ADD CONSTRAINT "environmental_social_screening_subprojectId_fkey" FOREIGN KEY ("subprojectId") REFERENCES "subprojects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environmental_social_screening" ADD CONSTRAINT "environmental_social_screening_responsibleForFillingFormId_fkey" FOREIGN KEY ("responsibleForFillingFormId") REFERENCES "responsible_for_filling_forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnvironAndSocialRiskAndImapactAssessementToLegalRequirementCon" ADD CONSTRAINT "_EnvironAndSocialRiskAndImapactAssessementToLegalRequire_A_fkey" FOREIGN KEY ("A") REFERENCES "environ_and_social_risk_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnvironAndSocialRiskAndImapactAssessementToLegalRequirementCon" ADD CONSTRAINT "_EnvironAndSocialRiskAndImapactAssessementToLegalRequire_B_fkey" FOREIGN KEY ("B") REFERENCES "legal_requirement_controls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AcceptanceConfirmationToOHSACTING" ADD CONSTRAINT "_AcceptanceConfirmationToOHSACTING_A_fkey" FOREIGN KEY ("A") REFERENCES "acceptance_confirmations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AcceptanceConfirmationToOHSACTING" ADD CONSTRAINT "_AcceptanceConfirmationToOHSACTING_B_fkey" FOREIGN KEY ("B") REFERENCES "ohs_acting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PessoasEnvolvidasNaInvestigacaoToRelatorioAcidenteIncidente" ADD CONSTRAINT "_PessoasEnvolvidasNaInvestigacaoToRelatorioAcidenteIncid_A_fkey" FOREIGN KEY ("A") REFERENCES "pessoas_envolvidas_na_investigacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PessoasEnvolvidasNaInvestigacaoToRelatorioAcidenteIncidente" ADD CONSTRAINT "_PessoasEnvolvidasNaInvestigacaoToRelatorioAcidenteIncid_B_fkey" FOREIGN KEY ("B") REFERENCES "relatorio_acidente_incidente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccoesImediatasECorrectivasToRelatorioAcidenteIncidente" ADD CONSTRAINT "_AccoesImediatasECorrectivasToRelatorioAcidenteIncidente_A_fkey" FOREIGN KEY ("A") REFERENCES "accoes_imediatas_e_correctivas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccoesImediatasECorrectivasToRelatorioAcidenteIncidente" ADD CONSTRAINT "_AccoesImediatasECorrectivasToRelatorioAcidenteIncidente_B_fkey" FOREIGN KEY ("B") REFERENCES "relatorio_acidente_incidente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IncidentFlashReportToIncidents" ADD CONSTRAINT "_IncidentFlashReportToIncidents_A_fkey" FOREIGN KEY ("A") REFERENCES "incident_flash_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IncidentFlashReportToIncidents" ADD CONSTRAINT "_IncidentFlashReportToIncidents_B_fkey" FOREIGN KEY ("B") REFERENCES "incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComplaintAndClaimRecordToPhotoDocumentProvingClosure" ADD CONSTRAINT "_ComplaintAndClaimRecordToPhotoDocumentProvingClosure_A_fkey" FOREIGN KEY ("A") REFERENCES "complaint_and_claim_record"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComplaintAndClaimRecordToPhotoDocumentProvingClosure" ADD CONSTRAINT "_ComplaintAndClaimRecordToPhotoDocumentProvingClosure_B_fkey" FOREIGN KEY ("B") REFERENCES "photo_document_proving_closure"("id") ON DELETE CASCADE ON UPDATE CASCADE;
