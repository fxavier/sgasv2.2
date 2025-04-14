interface EnvironmentalFactor {
  id: string;
  description: string;
}

interface RisksAndImpact {
  id: string;
  description: string;
}

interface Subproject {
  id: string;
  name: string;
}

interface ImpactAssessment {
  id?: string;
  departament?: Department;
  subproject?: Subproject;
  activity: string;
  risks_and_impact: RisksAndImpact;
  environmental_factor: EnvironmentalFactor;
  life_cycle: 'PRE_CONSTRUCAO' | 'CONSTRUCAO' | 'OPERACAO' | 'DESATIVACAO' | 'ENCERRAMENTO' | 'REINTEGRACAO_RESTAURACAO';
  statute: 'POSITIVO' | 'NEGATIVO';
  extension: 'LOCAL' | 'REGIONAL' | 'NACIONAL' | 'GLOBAL';
  duration: 'CURTO_PRAZO' | 'MEDIO_PRAZO' | 'LONGO_PRAZO';
  intensity: 'BAIXA' | 'MEDIA' | 'ALTA';
  probability: 'IMPROVAVEL' | 'PROVAVEL' | 'ALTAMENTE_PROVAVEL' | 'DEFINITIVA';
  significance?: string;
  description_of_measures: string;
  deadline: string;
  responsible?: string;
  effectiveness_assessment: string;
  legal_requirements: LegalRequirement[];
  compliance_requirements: string;
  observations: string;
  created_at?: string;
  updated_at?: string;
}