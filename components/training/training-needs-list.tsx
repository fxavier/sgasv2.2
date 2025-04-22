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

interface TrainingNeedsListProps {
  onEdit: (need: TrainingNeeds) => void;
}

const ITEMS_PER_PAGE = 5;

export function TrainingNeedsList({ onEdit }: TrainingNeedsListProps) {
  const [needs, setNeeds] = useState<TrainingNeeds[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Fetch training needs
  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/training-needs');
        if (!response.ok) {
          throw new Error('Failed to fetch training needs');
        }
        const data = await response.json();
        setNeeds(data);
      } catch (error) {
        console.error('Error fetching training needs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load training needs. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNeeds();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/training-needs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete training need');
      }

      setNeeds(needs.filter((need) => need.id !== id));
      toast({
        title: 'Training need deleted',
        description: 'The training need has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting training need:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete training need. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Filter needs based on search query
  const filteredNeeds = needs.filter(
    (need) =>
      need.training.toLowerCase().includes(searchQuery.toLowerCase()) ||
      need.filled_by.toLowerCase().includes(searchQuery.toLowerCase()) ||
      need.department?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredNeeds.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNeeds = filteredNeeds.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search training needs...'
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
            {filteredNeeds.length > 0
              ? Math.min(startIndex + 1, filteredNeeds.length)
              : 0}{' '}
            to {Math.min(startIndex + ITEMS_PER_PAGE, filteredNeeds.length)} of{' '}
            {filteredNeeds.length} needs
          </span>
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <div className='min-w-full'>
          {isLoading ? (
            <div className='flex justify-center items-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <span className='ml-2'>Loading training needs...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[15%]'>Filled By</TableHead>
                  <TableHead className='w-[15%]'>Department</TableHead>
                  <TableHead className='w-[20%]'>Training</TableHead>
                  <TableHead className='w-[20%]'>Training Entity</TableHead>
                  <TableHead className='w-[20%]'>Participants</TableHead>
                  <TableHead className='w-[10%] text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedNeeds.length > 0 ? (
                  paginatedNeeds.map((need) => (
                    <TableRow key={need.id}>
                      <TableCell className='font-medium'>
                        {need.filled_by}
                      </TableCell>
                      <TableCell>{need.department?.name || 'N/A'}</TableCell>
                      <TableCell>{need.training}</TableCell>
                      <TableCell>{need.proposal_of_training_entity}</TableCell>
                      <TableCell>
                        <div className='line-clamp-2'>
                          {need.potential_training_participants}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => onEdit(need)}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setDeleteId(need.id!)}
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
                      colSpan={6}
                      className='text-center py-8 text-gray-500'
                    >
                      {searchQuery
                        ? 'No training needs match your search'
                        : 'No training needs found'}
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
              training need.
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
