"use client";

import { useState } from "react";
import { NonComplianceList } from "@/components/communications/non-compliance/non-compliance-list";
import { NonComplianceForm } from "@/components/communications/non-compliance/non-compliance-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function NonCompliancePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompliance, setEditingCompliance] = useState<NonComplianceControl | null>(null);

  const handleEdit = (compliance: NonComplianceControl) => {
    setEditingCompliance(compliance);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Non Compliance Control</h1>
          <p className="text-gray-500 mt-2">Manage and track non-compliance records</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Non Compliance
        </Button>
      </div>

      <NonComplianceList onEdit={handleEdit} />
      
      <NonComplianceForm 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        compliance={editingCompliance}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCompliance(null);
        }}
      />
    </div>
  );
}