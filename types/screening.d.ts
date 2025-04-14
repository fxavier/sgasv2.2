interface ResponsibleForFillingForm {
  id: string;
  name: string;
}

interface ResponsibleForVerification {
  id: string;
  name: string;
}

interface BiodeversidadeRecursosNaturais {
  id: string;
  description: string;
}

interface ConsultationAndEngagement {
  id: string;
  subproject: Subproject;
  details: string;
}

interface ScreeningResult {
  id: string;
  subproject: Subproject;
  risk_category: 'ALTO' | 'SUBSTANCIAL' | 'MODERADO' | 'BAIXO';
  description: string;
  instruments_to_be_developed: string;
}

interface EnvironmentalSocialScreening {
  id?: string;
  responsible_for_filling_form: ResponsibleForFillingForm;
  responsible_for_verification: ResponsibleForVerification;
  subproject: Subproject;
  biodiversidade_recursos_naturais: BiodeversidadeRecursosNaturais;
  response: 'SIM' | 'NAO';
  comment?: string;
  relevant_standard?: string;
  consultation_and_engagement?: string;
  recomended_actions?: string;
  screening_results: ScreeningResult;
  created_at?: string;
  updated_at?: string;
}