"use client";

import { useState } from "react";
import { TrainingNeedsList } from "@/components/training/training-needs-list";
import { TrainingNeedsForm } from "@/components/training/training-needs-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TrainingNeedsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNeed, setEditingNeed] = useState<TrainingNeeds | null>(null);

  const handleEdit = (need: TrainingNeeds) => {
    setEditingNeed(need);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Training Needs</h1>
          <p className="text-gray-500 mt-2">Manage and track training needs</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Training Need
        </Button>
      </div>

      <TrainingNeedsList onEdit={handleEdit} />
      
      <TrainingNeedsForm 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        need={editingNeed}
        onClose={() => {
          setIsFormOpen(false);
          setEditingNeed(null);
        }}
      />
    </div>
  );
}