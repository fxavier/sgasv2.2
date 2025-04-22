'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Search, Loader2, Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { PreliminaryFormList } from '@/components/preliminary-form/preliminary-form-list';
import { PreliminaryFormForm } from '@/components/preliminary-form/preliminary-form-form';

export default function PreliminaryFormPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingForm, setEditingForm] =
    useState<PreliminaryEnvironmentalForm | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (form: PreliminaryEnvironmentalForm) => {
    setEditingForm(form);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    // Trigger a refresh of the forms list
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className='h-full w-full space-y-8'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-3xl font-bold text-gray-900'>
            MOD.AS.02 Preliminary Environmental Form
          </h1>
          <p className='text-gray-500 mt-2'>
            Manage and track preliminary environmental information
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className='flex items-center gap-2 w-full sm:w-auto'
        >
          <Plus className='h-4 w-4' />
          Add Form
        </Button>
      </div>

      <PreliminaryFormList key={refreshKey} onEdit={handleEdit} />

      <PreliminaryFormForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        form={editingForm}
        onClose={() => {
          setIsFormOpen(false);
          setEditingForm(null);
        }}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
