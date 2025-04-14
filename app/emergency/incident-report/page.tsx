"use client";

import { useState } from "react";
import { IncidentReportList } from "@/components/emergency/incident-report/incident-report-list";
import { IncidentReportForm } from "@/components/emergency/incident-report/incident-report-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function IncidentReportPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<IncidentReport | null>(null);

  const handleEdit = (report: IncidentReport) => {
    setEditingReport(report);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Incident Reports</h1>
          <p className="text-gray-500 mt-2">Manage and track incident reports</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Incident Report
        </Button>
      </div>

      <IncidentReportList onEdit={handleEdit} />
      
      <IncidentReportForm 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        report={editingReport}
        onClose={() => {
          setIsFormOpen(false);
          setEditingReport(null);
        }}
      />
    </div>
  );
}