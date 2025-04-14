interface WasteTransferLog {
  id?: string;
  waste_type: string;
  how_is_waste_contained: string;
  how_much_waste: number;
  reference_number: string;
  date_of_removal: string;
  transfer_company: string;
  special_instructions: string;
  created_at?: string;
  updated_at?: string;
}