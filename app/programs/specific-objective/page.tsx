"use client";

import { useState } from "react";
import { SpecificObjectiveList } from "@/components/specific-objective/specific-objective-list";
import { SpecificObjectiveForm } from "@/components/specific-objective/specific-objective-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function SpecificObjectivePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<SpecificObjective | null>(null);

  const handleEdit = (objective: SpecificObjective) => {
    setEditingObjective(objective);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Specific Objectives</h1>
          <p className="text-gray-500 mt-2">Manage your organization's specific objectives</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Specific Objective
        </Button>
      </div>

      <SpecificObjectiveList onEdit={handleEdit} />
      
      <SpecificObjectiveForm 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        objective={editingObjective}
        onClose={() => {
          setIsFormOpen(false);
          setEditingObjective(null);
        }}
      />
    </div>
  );
}