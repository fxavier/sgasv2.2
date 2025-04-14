interface PessoaEnvolvida {
  id?: number;
  nome: string;
  departamento: Department;
  outras_informacoes: string;
}

interface PessoasEnvolvidasNaInvestigacao {
  id?: number;
  nome: string;
  empresa: string;
  actividade: string;
  assinatura: string;
  data: string;
}

interface AccoesImediatasECorrectivas {
  id?: number;
  accao: string;
  descricao: string;
  responsavel: string;
  data: string;
  assinatura: string;
}

interface IncidentReport {
  id?: number;
  nome: string;
  funcao: string;
  departamento?: Department;
  subprojecto?: Subproject;
  data: string;
  hora: string;
  local: string;
  actividade_em_curso: string;
  descricao_do_acidente: string;
  tipo_de_incidente: 'Humano' | 'Segurança' | 'Infraestruturas' | 'Ambiental' | 'Social' | 'Outros';
  equipamento_envolvido: string;
  observacao: string;
  colaborador_envolvido_outro_acidente_antes: 'Sim' | 'Não';
  realizada_analise_risco_impacto_ambiental_antes: 'Sim' | 'Não';
  existe_procedimento_para_actividade: 'Sim' | 'Não';
  colaborador_recebeu_treinamento: 'Sim' | 'Não';
  incidente_envolve_empreteiro: 'Sim' | 'Não';
  nome_comercial_empreteiro?: string;
  natureza_e_extensao_incidente: 'Intoxicação leve' | 'Intoxicação grave' | 'Ferimento leve' | 'Ferimento grave' | 'Morte' | 'Nenhum' | 'Outros';
  possiveis_causas_acidente_metodologia: 'Falta de procedimentos para actividade' | 'Falhas no procedimento existente' | 'Falta de plano de trabalho' | 'Falha na comunicação' | 'Outros';
  possiveis_causas_acidente_equipamentos: 'Falha de equipamento' | 'Equipamento inapropriado' | 'Falha na protecção do equipamento' | 'Falha na sinalização' | 'Espaço inapropriado para equipamento' | 'Outros';
  possiveis_causas_acidente_material: 'Ferramenta defeituosa' | 'Falha na ferramenta' | 'Falta de inventário' | 'EPI inadequado' | 'Outros';
  possiveis_causas_acidente_colaboradores: 'Falta de treinamento' | 'Negligência do colaborador' | 'Negligência do operador sazonal' | 'Não concordância com procedimentos' | 'Uso inadequado de equipamento' | 'Outros';
  possiveis_causas_acidente_ambiente_e_seguranca: 'Agentes perigosos' | 'Falta de sinalização' | 'Pavimento irregular' | 'Pavimento escorregadio' | 'Outros';
  possiveis_causas_acidente_medicoes: 'Falta no instrumento de medição' | 'Instrumento de ajustamento inadequado' | 'Falha no instrumento de calibração' | 'Falta de inspenção' | 'Outros';
  pessoa_envolvida: PessoaEnvolvida;
  pessoas_envolvidas_na_investigacao: PessoasEnvolvidasNaInvestigacao[];
  accoes_imediatas_e_correctivas: AccoesImediatasECorrectivas[];
  fotografia_frontal?: string;
  fotografia_posterior?: string;
  fotografia_lateral_direita?: string;
  fotografia_lateral_esquerda?: string;
  fotografia_do_melhor_angulo?: string;
  fotografia?: string;
  criado_em: string;
}

interface FirstAidKitChecklist {
  id?: number;
  descricao: string;
  quantidade: number;
  data: string;
  prazo: string;
  observacao: string;
  inspecao_realizada_por: string;
}

interface Incident {
  id?: number;
  description: string;
}

interface IncidentFlashReport {
  id?: number;
  incidents: Incident[];
  date_incident: string;
  time_incident: string;
  section?: string;
  location_incident: string;
  date_reported: string;
  supervisor: string;
  type: 'Employee' | 'Subcontrator';
  employee_name?: string;
  subcontrator_name?: string;
  incident_description: string;
  details_of_injured_person: string;
  witness_statement?: string;
  preliminary_findings?: string;
  recomendations: string;
  further_investigation_required: 'Yes' | 'No';
  incident_reportable: 'Yes' | 'No';
  lenders_to_be_notified: 'Yes' | 'No';
  author_of_report: string;
  date_created: string;
  approver_name: string;
  date_approved: string;
}