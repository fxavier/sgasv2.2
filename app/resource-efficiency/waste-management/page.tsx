'use client';

import { useState } from 'react';
import { WasteManagementList } from '@/components/resource-efficiency/waste-management/waste-management-list';
import { WasteManagementForm } from '@/components/resource-efficiency/waste-management/waste-management-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function WasteManagementPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWaste, setEditingWaste] = useState<WasteManagement | null>(
    null
  );
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (waste: WasteManagement) => {
    setEditingWaste(waste);
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
            FR.AS.032 Waste Management
          </h1>
          <p className='text-gray-500 mt-2'>
            Manage and track waste management records
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className='flex items-center gap-2 w-full sm:w-auto'
        >
          <Plus className='h-4 w-4' />
          Add Waste Management
        </Button>
      </div>

      <WasteManagementList key={refreshKey} onEdit={handleEdit} />

      <WasteManagementForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        waste={editingWaste}
        onClose={() => {
          setIsFormOpen(false);
          setEditingWaste(null);
        }}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
