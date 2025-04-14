"use client";

import { useState } from "react";
import { TrainingPlanList } from "@/components/training/training-plan-list";
import { TrainingPlanForm } from "@/components/training/training-plan-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TrainingPlansPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<TrainingPlan | null>(null);

  const handleEdit = (plan: TrainingPlan) => {
    setEditingPlan(plan);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Training Plans</h1>
          <p className="text-gray-500 mt-2">Manage and track training plans</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Training Plan
        </Button>
      </div>

      <TrainingPlanList onEdit={handleEdit} />
      
      <TrainingPlanForm 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        plan={editingPlan}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPlan(null);
        }}
      />
    </div>
  );
}