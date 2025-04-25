'use client';

import { useState } from 'react';
import { FirstAidKitChecklistList } from '@/components/emergency/first-aid-checklist/first-aid-checklist-list';
import { FirstAidKitChecklistForm } from '@/components/emergency/first-aid-checklist/first-aid-checklist-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function FirstAidKitChecklistPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChecklist, setEditingChecklist] =
    useState<FirstAidKitChecklist | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (checklist: FirstAidKitChecklist) => {
    setEditingChecklist(checklist);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    // Trigger a refresh of the checklist items
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className='container mx-auto max-w-7xl px-4 py-6 space-y-8'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-3xl font-bold text-gray-900'>
            First Aid Kit Checklist
          </h1>
          <p className='text-gray-500 mt-2'>
            Manage and track first aid kit inventory
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className='flex items-center gap-2 w-full sm:w-auto'
        >
          <Plus className='h-4 w-4' />
          Add Checklist Entry
        </Button>
      </div>

      <FirstAidKitChecklistList key={refreshKey} onEdit={handleEdit} />

      <FirstAidKitChecklistForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        checklist={editingChecklist}
        onClose={() => {
          setIsFormOpen(false);
          setEditingChecklist(null);
        }}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
