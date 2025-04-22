'use client';

import { useState } from 'react';
import { ScreeningList } from '@/components/screening/screening-list';
import { ScreeningForm } from '@/components/screening/screening-form';
import { ResponsiblePersonForm } from '@/components/responsible-person/responsible-person-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ScreeningFormPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isResponsibleFormOpen, setIsResponsibleFormOpen] = useState(false);
  const [editingScreening, setEditingScreening] =
    useState<EnvironmentalSocialScreening | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  const handleEdit = (screening: EnvironmentalSocialScreening) => {
    setEditingScreening(screening);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    // Trigger a refresh of the screenings list
    setRefreshKey((prev) => prev + 1);
  };

  const handleResponsibleSuccess = () => {
    toast({
      title: 'Responsible Person Added',
      description: 'New responsible person has been successfully added.',
    });
    // We don't need to refresh the main list here, as the combobox in the form will handle that
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
        <div className='flex gap-2'>
          <Button
            onClick={() => setIsFormOpen(true)}
            className='flex items-center gap-2'
          >
            <Plus className='h-4 w-4' />
            Add Screening
          </Button>
          <Button
            variant='outline'
            onClick={() => setIsResponsibleFormOpen(true)}
            className='flex items-center gap-2'
          >
            <Plus className='h-4 w-4' />
            Add Responsible Person
          </Button>
        </div>
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

      <ResponsiblePersonForm
        open={isResponsibleFormOpen}
        onOpenChange={setIsResponsibleFormOpen}
        person={null}
        onClose={() => setIsResponsibleFormOpen(false)}
        onSuccess={handleResponsibleSuccess}
      />
    </div>
  );
}
