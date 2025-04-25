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

interface WorkerGrievanceListProps {
  onEdit: (grievance: WorkerGrievance) => void;
}

const ITEMS_PER_PAGE = 5;

const getContactMethodColor = (method: string) => {
  const colors = {
    EMAIL: 'bg-blue-100 text-blue-800',
    PHONE: 'bg-green-100 text-green-800',
    FACE_TO_FACE: 'bg-purple-100 text-purple-800',
  };
  return colors[method as keyof typeof colors] || colors.EMAIL;
};

const getLanguageColor = (language: string) => {
  const colors = {
    PORTUGUESE: 'bg-yellow-100 text-yellow-800',
    ENGLISH: 'bg-blue-100 text-blue-800',
    OTHER: 'bg-gray-100 text-gray-800',
  };
  return colors[language as keyof typeof colors] || colors.OTHER;
};

export function WorkerGrievanceList({ onEdit }: WorkerGrievanceListProps) {
  const [grievances, setGrievances] = useState<WorkerGrievance[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Fetch worker grievances
  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/worker-grievance');
        if (!response.ok) {
          throw new Error('Failed to fetch worker grievances');
        }
        const data = await response.json();
        setGrievances(data);
      } catch (error) {
        console.error('Error fetching worker grievances:', error);
        toast({
          title: 'Error',
          description: 'Failed to load worker grievances. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrievances();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/worker-grievance/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete worker grievance');
      }

      setGrievances(grievances.filter((grievance) => grievance.id !== id));
      toast({
        title: 'Grievance deleted',
        description: 'The worker grievance has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting worker grievance:', error);
      toast({
        title: 'Error',
        description:
          error.message ||
          'Failed to delete worker grievance. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Filter grievances based on search query
  const filteredGrievances = grievances.filter(
    (grievance) =>
      grievance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grievance.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grievance.grievance_details
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredGrievances.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedGrievances = filteredGrievances.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search grievances...'
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
            {filteredGrievances.length > 0
              ? Math.min(startIndex + 1, filteredGrievances.length)
              : 0}{' '}
            to{' '}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredGrievances.length)}{' '}
            of {filteredGrievances.length} grievances
          </span>
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <div className='min-w-full'>
          {isLoading ? (
            <div className='flex justify-center items-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <span className='ml-2'>Loading worker grievances...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[15%]'>Name</TableHead>
                  <TableHead className='w-[15%]'>Company</TableHead>
                  <TableHead className='w-[25%]'>Details</TableHead>
                  <TableHead className='w-[15%]'>Contact Method</TableHead>
                  <TableHead className='w-[10%]'>Language</TableHead>
                  <TableHead className='w-[10%]'>Date</TableHead>
                  <TableHead className='w-[10%] text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedGrievances.length > 0 ? (
                  paginatedGrievances.map((grievance) => (
                    <TableRow key={grievance.id}>
                      <TableCell className='font-medium'>
                        {grievance.name}
                      </TableCell>
                      <TableCell>{grievance.company}</TableCell>
                      <TableCell>
                        <div className='line-clamp-2'>
                          {grievance.grievance_details}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={getContactMethodColor(
                            grievance.prefered_contact_method
                          )}
                        >
                          {grievance.prefered_contact_method.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={getLanguageColor(
                            grievance.prefered_language
                          )}
                        >
                          {grievance.prefered_language}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(grievance.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => onEdit(grievance)}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setDeleteId(grievance.id!)}
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
                        ? 'No grievances match your search'
                        : 'No worker grievances found'}
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
              worker grievance.
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
