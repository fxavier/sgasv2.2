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
