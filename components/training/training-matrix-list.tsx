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

interface TrainingMatrixListProps {
  onEdit: (matrix: TrainingMatrix) => void;
}

const ITEMS_PER_PAGE = 5;

const getEffectivenessColor = (effectiveness: string) => {
  return effectiveness === 'Effective'
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800';
};

export function TrainingMatrixList({ onEdit }: TrainingMatrixListProps) {
  const [matrix, setMatrix] = useState<TrainingMatrix[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Fetch training matrix entries
  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/training-matrix');
        if (!response.ok) {
          throw new Error('Failed to fetch training matrix');
        }
        const data = await response.json();
        setMatrix(data);
      } catch (error) {
        console.error('Error fetching training matrix:', error);
        toast({
          title: 'Error',
          description: 'Failed to load training matrix. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatrix();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/training-matrix/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete training matrix entry');
      }

      setMatrix(matrix.filter((m) => m.id !== id));
      toast({
        title: 'Matrix entry deleted',
        description: 'The training matrix entry has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting training matrix entry:', error);
      toast({
        title: 'Error',
        description:
          'Failed to delete training matrix entry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Filter matrix based on search query
  const filteredMatrix = matrix.filter(
    (m) =>
      m.position.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.training.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.toolbox_talks.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.approved_by.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredMatrix.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMatrix = filteredMatrix.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search matrix...'
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
            {filteredMatrix.length > 0
              ? Math.min(startIndex + 1, filteredMatrix.length)
              : 0}{' '}
            to {Math.min(startIndex + ITEMS_PER_PAGE, filteredMatrix.length)} of{' '}
            {filteredMatrix.length} entries
          </span>
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <div className='min-w-full'>
          {isLoading ? (
            <div className='flex justify-center items-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <span className='ml-2'>Loading training matrix...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[15%]'>Position</TableHead>
                  <TableHead className='w-[20%]'>Training</TableHead>
                  <TableHead className='w-[20%]'>Toolbox Talks</TableHead>
                  <TableHead className='w-[10%]'>Effectiveness</TableHead>
                  <TableHead className='w-[15%]'>Approved By</TableHead>
                  <TableHead className='w-[10%]'>Date</TableHead>
                  <TableHead className='w-[10%] text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMatrix.length > 0 ? (
                  paginatedMatrix.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className='font-medium'>
                        {m.position.name}
                      </TableCell>
                      <TableCell>{m.training.name}</TableCell>
                      <TableCell>{m.toolbox_talks.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={getEffectivenessColor(m.effectiveness)}
                        >
                          {m.effectiveness}
                        </Badge>
                      </TableCell>
                      <TableCell>{m.approved_by}</TableCell>
                      <TableCell>
                        {m.date ? new Date(m.date).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => onEdit(m)}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setDeleteId(m.id!)}
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
                        ? 'No matrix entries match your search'
                        : 'No matrix entries found'}
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
              training matrix entry.
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
