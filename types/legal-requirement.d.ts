interface LegalRequirement {
  id?: string;
  number: string;
  document_title: string;
  effective_date: string;
  description: string;
  status: 'active' | 'inactive' | 'pending' | 'expired';
  amended_description?: string;
  observation?: string;
  law_file?: string;
  created_at?: string;
  updated_at?: string;
}