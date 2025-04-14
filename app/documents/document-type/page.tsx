'use client';

import { useState } from 'react';
import { DocumentTypeList } from '@/components/documents/document-type/document-type-list';
import { DocumentTypeForm } from '@/components/documents/document-type/document-type-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function DocumentTypePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingType, setEditingType] = useState<DocumentType | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (type: DocumentType) => {
    setEditingType(type);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    // Trigger a refresh of the document types list
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className='container mx-auto max-w-7xl px-4 py-6 space-y-8'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-3xl font-bold text-gray-900'>Document Types</h1>
          <p className='text-gray-500 mt-2'>Manage document types</p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className='flex items-center gap-2 w-full sm:w-auto'
        >
          <Plus className='h-4 w-4' />
          Add Document Type
        </Button>
      </div>

      <DocumentTypeList key={refreshKey} onEdit={handleEdit} />

      <DocumentTypeForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        type={editingType}
        onClose={() => {
          setIsFormOpen(false);
          setEditingType(null);
        }}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
