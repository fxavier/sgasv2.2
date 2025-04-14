"use client";

import { useState } from "react";
import { ComplaintsRegistrationList } from "@/components/communications/complaints-registration/complaints-registration-list";
import { ComplaintsRegistrationForm } from "@/components/communications/complaints-registration/complaints-registration-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ComplaintsRegistrationPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState<ComplaintAndClaimRecord | null>(null);

  const handleEdit = (complaint: ComplaintAndClaimRecord) => {
    setEditingComplaint(complaint);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Complaints and Claims Registration</h1>
          <p className="text-gray-500 mt-2">Manage and track complaints and claims records</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Registration
        </Button>
      </div>

      <ComplaintsRegistrationList onEdit={handleEdit} />
      
      <ComplaintsRegistrationForm 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        complaint={editingComplaint}
        onClose={() => {
          setIsFormOpen(false);
          setEditingComplaint(null);
        }}
      />
    </div>
  );
}