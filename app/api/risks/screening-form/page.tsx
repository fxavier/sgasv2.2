'use client';

import { useState } from 'react';
import { ScreeningList } from '@/components/screening/screening-list';
import { ScreeningForm } from '@/components/screening/screening-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ScreeningFormPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScreening, setEditingScreening] =
    useState<EnvironmentalSocialScreening | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (screening: EnvironmentalSocialScreening) => {
    setEditingScreening(screening);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    // Trigger a refresh of the screenings list
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className='h-full w-full space-y-8'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Environmental & Screening Form
          </h1>
          <p className='text-gray-500 mt-2'>
            Manage and track environmental screening assessments
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className='flex items-center gap-2 w-full sm:w-auto'
        >
          <Plus className='h-4 w-4' />
          Add Screening
        </Button>
      </div>

      <ScreeningList key={refreshKey} onEdit={handleEdit} />

      <ScreeningForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        screening={editingScreening}
        onClose={() => {
          setIsFormOpen(false);
          setEditingScreening(null);
        }}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
