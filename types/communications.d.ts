interface NonComplianceControl {
  id?: string;
  number: string;
  department?: Department;
  subproject?: Subproject;
  non_compliance_description: string;
  identified_causes: string;
  corrective_actions: string;
  responsible_person: string;
  deadline: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  effectiveness_evaluation: 'EFFECTIVE' | 'NOT_EFFECTIVE';
  responsible_person_evaluation: string;
  observation: string;
  created_at?: string;
  updated_at?: string;
}

interface ClaimComplainControl {
  id?: string;
  number: string;
  claim_complain_submitted_by: string;
  claim_complain_reception_date: string;
  claim_complain_description: string;
  treatment_action: string;
  claim_complain_responsible_person: string;
  claim_complain_deadline: string;
  claim_complain_status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  closure_date: string;
  observation: string;
  created_at?: string;
  updated_at?: string;
}

interface ComplaintAndClaimRecord {
  id?: string;
  number: string;
  date_occurred: string;
  local_occurrence: string;
  how_occurred: string;
  who_involved: string;
  report_and_explanation: string;
  registered_date: string;
  claim_local_occurrence: string;
  complaintant_gender: 'MALE' | 'FEMALE';
  complaintant_age: number;
  anonymous_complaint: 'YES' | 'NO';
  telephone: string;
  email?: string;
  complaintant_address: string;
  complaintant_accepted: 'YES' | 'NO';
  action_taken: string;
  complaintant_notified: 'YES' | 'NO';
  notification_method: string;
  closing_date: string;
  claim_category: 'Odor' | 'Noise' | 'Effluents' | 'Company vehicles' | 'Flow of migrant workers' | 'Security personnel' | 'GBV/SA/SEA' | 'Other';
  other_claim_category?: string;
  inspection_date: string;
  collected_information: 'Photos' | 'Proof of legitimacy documents';
  resolution_type: 'Internal resolution' | 'Second level resolution' | 'Third level resolution';
  resolution_date: string;
  resolution_submitted: 'YES' | 'NO';
  corrective_action_taken: string;
  involved_in_resolution: string;
  complaintant_satisfaction: 'SATISFIED' | 'NOT_SATISFIED';
  resources_spent: number;
  number_of_days_since_received_to_closure: number;
  monitoring_after_closure: 'YES' | 'NO';
  monitoring_method_and_frequency: string;
  follow_up: string;
  involved_institutions?: string;
  suggested_preventive_actions: string;
  created_at?: string;
  updated_at?: string;
}

interface WorkerGrievance {
  id?: string;
  name: string;
  company: string;
  date: string;
  prefered_contact_method: 'EMAIL' | 'PHONE' | 'FACE_TO_FACE';
  contact: string;
  prefered_language: 'PORTUGUESE' | 'ENGLISH' | 'OTHER';
  other_language?: string;
  grievance_details: string;
  unique_identification_of_company_acknowlegement: string;
  name_of_person_acknowledging_grievance: string;
  position_of_person_acknowledging_grievance: string;
  date_of_acknowledgement: string;
  signature_of_person_acknowledging_grievance: string;
  follow_up_details: string;
  closed_out_date: string;
  signature_of_response_corrective_action_person: string;
  acknowledge_receipt_of_response: string;
  name_of_person_acknowledging_response: string;
  signature_of_person_acknowledging_response: string;
  date_of_acknowledgement_response: string;
  created_at?: string;
  updated_at?: string;
}