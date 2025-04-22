'use client';

import { useState } from 'react';
import { ImpactAssessmentList } from '@/components/impact-assessment/impact-assessment-list';
import { ImpactAssessmentForm } from '@/components/impact-assessment/impact-assessment-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ImpactAssessmentPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] =
    useState<ImpactAssessment | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (assessment: ImpactAssessment) => {
    setEditingAssessment(assessment);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    // Trigger a refresh of the assessments list
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className='h-full w-full space-y-8'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Environmental & Impact Assessment
          </h1>
          <p className='text-gray-500 mt-2'>
            Manage and track environmental impacts and risks
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className='flex items-center gap-2 w-full sm:w-auto'
        >
          <Plus className='h-4 w-4' />
          Add Assessment
        </Button>
      </div>

      <ImpactAssessmentList key={refreshKey} onEdit={handleEdit} />

      <ImpactAssessmentForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        assessment={editingAssessment}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAssessment(null);
        }}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
