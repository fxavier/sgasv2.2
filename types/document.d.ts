interface DocumentType {
  id?: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

interface Document {
  id?: string;
  code: string;
  creation_date: string;
  revision_date: string;
  document_name: string;
  document_type: DocumentType;
  document_path: string;
  document_state: 'REVISION' | 'INUSE' | 'OBSOLETE';
  retention_period: string;
  disposal_method: string;
  observation: string;
  created_at?: string;
  updated_at?: string;
}