'use client';

import { useState } from 'react';
import { ClaimControlList } from '@/components/communications/claim-control/claim-control-list';
import { ClaimControlForm } from '@/components/communications/claim-control/claim-control-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ClaimControlPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClaim, setEditingClaim] = useState<ClaimComplainControl | null>(
    null
  );
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (claim: ClaimComplainControl) => {
    setEditingClaim(claim);
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
            FR.AS.013_Claim And Complain Control
          </h1>
          <p className='text-gray-500 mt-2'>
            Manage and track claims and complaints
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className='flex items-center gap-2 w-full sm:w-auto'
        >
          <Plus className='h-4 w-4' />
          Add Claim/Complaint
        </Button>
      </div>

      <ClaimControlList key={refreshKey} onEdit={handleEdit} />

      <ClaimControlForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        claim={editingClaim}
        onClose={() => {
          setIsFormOpen(false);
          setEditingClaim(null);
        }}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
