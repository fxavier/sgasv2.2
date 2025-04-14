"use client";

import { useState } from "react";
import { OHSActingList } from "@/components/training/ohs-acting-list";
import { OHSActingForm } from "@/components/training/ohs-acting-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function OHSActingPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<OHSActing | null>(null);

  const handleEdit = (entry: OHSActing) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">OHS ACTING</h1>
          <p className="text-gray-500 mt-2">Manage OHS acting records</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add OHS Entry
        </Button>
      </div>

      <OHSActingList onEdit={handleEdit} />
      
      <OHSActingForm 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        entry={editingEntry}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEntry(null);
        }}
      />
    </div>
  );
}