interface ResponsibleForFillingForm {
  id?: string;
  name: string;
  role: string;
  contact: string;
  date: string;
  signature?: string;
  created_at?: string;
  updated_at?: string;
}

interface ContactPerson {
  id?: string;
  name: string;
  role: string;
  contact: string;
  date: string;
  signature?: string;
  created_at?: string;
  updated_at?: string;
}

interface ResponsibleForVerification {
  id?: string;
  contactPerson: ContactPerson;
  created_at?: string;
  updated_at?: string;
}
