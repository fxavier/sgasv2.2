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
import { Pencil, Trash2, Search, Loader2 } from 'lucide-react';
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

interface PreliminaryFormListProps {
  onEdit: (form: PreliminaryEnvironmentalForm) => void;
}

const ITEMS_PER_PAGE = 5;

const getActivityTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    TURISTICA: 'Turística',
    INDUSTRIAL: 'Industrial',
    AGRO_PECUARIA: 'Agro-Pecuária',
    ENERGETICA: 'Energética',
    SERVICOS: 'Serviços',
    OUTRA: 'Outra',
  };
  return labels[type] || type;
};

const getDevelopmentStageLabel = (stage: string) => {
  const labels: Record<string, string> = {
    NOVA: 'Nova',
    REABILITACAO: 'Reabilitação',
    EXPANSAO: 'Expansão',
    OUTRO: 'Outro',
  };
  return labels[stage] || stage;
};

export function PreliminaryFormList({ onEdit }: PreliminaryFormListProps) {
  const [forms, setForms] = useState<PreliminaryEnvironmentalForm[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Fetch preliminary forms
  useEffect(() => {
    const fetchForms = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/preliminary-forms');
        if (!response.ok) {
          throw new Error('Failed to fetch preliminary forms');
        }
        const data = await response.json();
        setForms(data);
      } catch (error) {
        console.error('Error fetching preliminary forms:', error);
        toast({
          title: 'Error',
          description: 'Failed to load preliminary forms. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchForms();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/preliminary-forms/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete preliminary form');
      }

      setForms(forms.filter((form) => form.id !== id));
      toast({
        title: 'Form deleted',
        description:
          'The preliminary environmental form has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting preliminary form:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete preliminary form. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Filter forms based on search query
  const filteredForms = forms.filter(
    (form) =>
      form.activity_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.activity_location
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      form.activity_city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredForms.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedForms = filteredForms.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search forms...'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className='pl-10'
          />
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-500'>
            Showing{' '}
            {filteredForms.length > 0
              ? Math.min(startIndex + 1, filteredForms.length)
              : 0}{' '}
            to {Math.min(startIndex + ITEMS_PER_PAGE, filteredForms.length)} of{' '}
            {filteredForms.length} forms
          </span>
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <div className='min-w-full'>
          {isLoading ? (
            <div className='flex justify-center items-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <span className='ml-2'>Loading preliminary forms...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[20%]'>Activity Name</TableHead>
                  <TableHead className='w-[15%]'>Type</TableHead>
                  <TableHead className='w-[15%]'>Stage</TableHead>
                  <TableHead className='w-[15%]'>Location</TableHead>
                  <TableHead className='w-[15%]'>Province</TableHead>
                  <TableHead className='w-[10%]'>Investment</TableHead>
                  <TableHead className='w-[10%] text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedForms.length > 0 ? (
                  paginatedForms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className='font-medium'>
                        {form.activity_name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className='bg-blue-100 text-blue-800'
                        >
                          {getActivityTypeLabel(form.activity_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className='bg-purple-100 text-purple-800'
                        >
                          {getDevelopmentStageLabel(form.development_stage)}
                        </Badge>
                      </TableCell>
                      <TableCell>{form.activity_city}</TableCell>
                      <TableCell>
                        {form.activity_province.replace('_', ' ')}
                      </TableCell>
                      <TableCell>
                        {form.total_investment_value?.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'MZN',
                        })}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => onEdit(form)}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setDeleteId(form.id!)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className='text-center py-8 text-gray-500'
                    >
                      {searchQuery
                        ? 'No forms match your search'
                        : 'No preliminary forms found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex items-center justify-center gap-2 mt-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size='sm'
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => !isDeleting && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              preliminary environmental form.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className='bg-red-600 hover:bg-red-700'
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
