'use client';

import { useState } from 'react';
import { BiodiversityList } from '@/components/biodiversity/biodiversity-list';
import { BiodiversityForm } from '@/components/biodiversity/biodiversity-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function BiodiversityResourcesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResource, setEditingResource] =
    useState<BiodeversidadeRecursosNaturais | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (resource: BiodeversidadeRecursosNaturais) => {
    setEditingResource(resource);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    // Trigger a refresh of the resources list
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className='container mx-auto max-w-7xl px-4 py-6 space-y-8'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Biodiversity Resources
          </h1>
          <p className='text-gray-500 mt-2'>
            Manage biodiversity and natural resources
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className='flex items-center gap-2 w-full sm:w-auto'
        >
          <Plus className='h-4 w-4' />
          Add Resource
        </Button>
      </div>

      <BiodiversityList key={refreshKey} onEdit={handleEdit} />

      <BiodiversityForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        resource={editingResource}
        onClose={() => {
          setIsFormOpen(false);
          setEditingResource(null);
        }}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
