'use client';

import { useState } from 'react';
import { DocumentList } from '@/components/documents/document/document-list';
import { DocumentForm } from '@/components/documents/document/document-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function DocumentPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (document: Document) => {
    setEditingDocument(document);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    // Trigger a refresh of the documents list
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className='container mx-auto max-w-7xl px-4 py-6 space-y-8'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-3xl font-bold text-gray-900'>Documents</h1>
          <p className='text-gray-500 mt-2'>Manage documents</p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className='flex items-center gap-2 w-full sm:w-auto'
        >
          <Plus className='h-4 w-4' />
          Add Document
        </Button>
      </div>

      <DocumentList key={refreshKey} onEdit={handleEdit} />

      <DocumentForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        document={editingDocument}
        onClose={() => {
          setIsFormOpen(false);
          setEditingDocument(null);
        }}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
