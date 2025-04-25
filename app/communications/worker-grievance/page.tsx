'use client';

import { useState } from 'react';
import { WorkerGrievanceList } from '@/components/communications/worker-grievance/worker-grievance-list';
import { WorkerGrievanceForm } from '@/components/communications/worker-grievance/worker-grievance-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function WorkerGrievancePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGrievance, setEditingGrievance] =
    useState<WorkerGrievance | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (grievance: WorkerGrievance) => {
    setEditingGrievance(grievance);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    // Trigger a refresh of the list
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className='container mx-auto max-w-7xl px-4 py-6 space-y-8'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-3xl font-bold text-gray-900'>
            FR.AS.033 Worker Grievance
          </h1>
          <p className='text-gray-500 mt-2'>
            Manage and track worker grievances
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className='flex items-center gap-2 w-full sm:w-auto'
        >
          <Plus className='h-4 w-4' />
          Add Grievance
        </Button>
      </div>

      <WorkerGrievanceList key={refreshKey} onEdit={handleEdit} />

      <WorkerGrievanceForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        grievance={editingGrievance}
        onClose={() => {
          setIsFormOpen(false);
          setEditingGrievance(null);
        }}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
