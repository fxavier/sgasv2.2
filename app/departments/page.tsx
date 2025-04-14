"use client";

import { useState } from "react";
import { DepartmentList } from "@/components/departments/department-list";
import { DepartmentForm } from "@/components/departments/department-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DepartmentsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-500 mt-2">Manage and track departments</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Department
        </Button>
      </div>

      <DepartmentList onEdit={handleEdit} />
      
      <DepartmentForm 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        department={editingDepartment}
        onClose={() => {
          setIsFormOpen(false);
          setEditingDepartment(null);
        }}
      />
    </div>
  );
}