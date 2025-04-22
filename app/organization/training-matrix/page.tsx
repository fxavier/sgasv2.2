'use client';

import { useState } from 'react';
import { TrainingMatrixList } from '@/components/training/training-matrix-list';
import { TrainingMatrixForm } from '@/components/training/training-matrix-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function TrainingMatrixPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMatrix, setEditingMatrix] = useState<TrainingMatrix | null>(
    null
  );
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (matrix: TrainingMatrix) => {
    setEditingMatrix(matrix);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    // Trigger a refresh of the training matrix list
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className='container mx-auto max-w-6xl px-4 py-6 space-y-8'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-3xl font-bold text-gray-900'>
            FR.AS.006 Training Matrix
          </h1>
          <p className='text-gray-500 mt-2'>
            Manage training matrix and effectiveness
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className='flex items-center gap-2 w-full sm:w-auto'
        >
          <Plus className='h-4 w-4' />
          Add Matrix Entry
        </Button>
      </div>

      <TrainingMatrixList key={refreshKey} onEdit={handleEdit} />

      <TrainingMatrixForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        matrix={editingMatrix}
        onClose={() => {
          setIsFormOpen(false);
          setEditingMatrix(null);
        }}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
