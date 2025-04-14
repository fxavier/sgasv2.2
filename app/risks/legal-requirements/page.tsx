"use client";

import { useState } from "react";
import { LegalRequirementList } from "@/components/legal-requirements/legal-requirement-list";
import { LegalRequirementForm } from "@/components/legal-requirements/legal-requirement-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function LegalRequirementsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<LegalRequirement | null>(null);

  const handleEdit = (requirement: LegalRequirement) => {
    setEditingRequirement(requirement);
    setIsFormOpen(true);
  };

  return (
    <div className="h-full w-full space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Legal Requirements Control</h1>
          <p className="text-gray-500 mt-2">Manage and track legal requirements and compliance</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Requirement
        </Button>
      </div>

      <LegalRequirementList onEdit={handleEdit} />
      
      <LegalRequirementForm 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        requirement={editingRequirement}
        onClose={() => {
          setIsFormOpen(false);
          setEditingRequirement(null);
        }}
      />
    </div>
  );
}