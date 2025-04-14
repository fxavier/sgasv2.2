"use client";

import { useState } from "react";
import { PreliminaryFormList } from "@/components/preliminary-form/preliminary-form-list";
import { PreliminaryFormForm } from "@/components/preliminary-form/preliminary-form-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function PreliminaryFormPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<PreliminaryEnvironmentalForm | null>(null);

  const handleEdit = (form: PreliminaryEnvironmentalForm) => {
    setEditingForm(form);
    setIsFormOpen(true);
  };

  return (
    <div className="h-full w-full space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Preliminary Environmental Information Form</h1>
          <p className="text-gray-500 mt-2">Manage and track preliminary environmental information</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Form
        </Button>
      </div>

      <PreliminaryFormList onEdit={handleEdit} />
      
      <PreliminaryFormForm 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        form={editingForm}
        onClose={() => {
          setIsFormOpen(false);
          setEditingForm(null);
        }}
      />
    </div>
  );
}