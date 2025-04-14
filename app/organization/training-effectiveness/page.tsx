"use client";

import { useState } from "react";
import { TrainingEffectivenessAssessmentList } from "@/components/training/training-effectiveness-list";
import { TrainingEffectivenessAssessmentForm } from "@/components/training/training-effectiveness-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TrainingEffectivenessPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<TrainingEffectivnessAssessment | null>(null);

  const handleEdit = (assessment: TrainingEffectivnessAssessment) => {
    setEditingAssessment(assessment);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Training Effectiveness Assessment</h1>
          <p className="text-gray-500 mt-2">Evaluate and track training effectiveness</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Assessment
        </Button>
      </div>

      <TrainingEffectivenessAssessmentList onEdit={handleEdit} />
      
      <TrainingEffectivenessAssessmentForm 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        assessment={editingAssessment}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAssessment(null);
        }}
      />
    </div>
  );
}