interface TrainingNeeds {
  id?: string;
  filled_by: string;
  date: string;
  department?: Department;
  subproject?: Subproject;
  training: string;
  training_objective: string;
  proposal_of_training_entity: string;
  potential_training_participants: string;
  created_at?: string;
  updated_at?: string;
}

interface TrainingPlan {
  id?: string;
  updated_by: string;
  date: string;
  year: number;
  training_area: string;
  training_title: string;
  training_objective: string;
  training_type: 'Internal' | 'External';
  training_entity: string;
  duration: string;
  number_of_trainees: number;
  training_recipients: string;
  training_month: 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December';
  training_status: 'Planned' | 'Completed';
  observations: string;
  created_at?: string;
  updated_at?: string;
}

interface TrainingEvaluationQuestion {
  id: string;
  question: string;
}

interface TrainingEffectivnessAssessment {
  id?: string;
  training: string;
  date: string;
  department?: Department;
  subproject?: Subproject;
  trainee: string;
  immediate_supervisor: string;
  training_evaluation_question: TrainingEvaluationQuestion;
  answer: 'Satisfactory' | 'Partially Satisfactory' | 'Unsatisfactory';
  human_resource_evaluation: 'effective' | 'ineffective';
  created_at?: string;
  updated_at?: string;
}

interface Position {
  id: string;
  name: string;
}

interface Training {
  id: string;
  name: string;
}

interface ToolBoxTalks {
  id: string;
  name: string;
}

interface TrainingMatrix {
  id?: string;
  date?: string;
  position: Position;
  training: Training;
  toolbox_talks: ToolBoxTalks;
  effectiveness: 'Effective' | 'Not effective';
  actions_training_not_effective?: string;
  approved_by: string;
  created_at?: string;
  updated_at?: string;
}

interface AcceptanceConfirmation {
  id: string;
  description: string;
}

interface OHSActing {
  id?: string;
  fullname: string;
  designation?: string;
  terms_of_office_from?: string;
  terms_of_office_to?: string;
  acceptance_confirmation: AcceptanceConfirmation[];
  date: string;
  created_at?: string;
  updated_at?: string;
}