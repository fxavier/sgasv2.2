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

interface NonComplianceListProps {
  onEdit: (compliance: NonComplianceControl) => void;
}

const ITEMS_PER_PAGE = 5;

const getStatusColor = (status: string) => {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
  };
  return colors[status as keyof typeof colors] || colors.PENDING;
};

const getEffectivenessColor = (effectiveness: string) => {
  return effectiveness === 'EFFECTIVE'
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800';
};

export function NonComplianceList({ onEdit }: NonComplianceListProps) {
  const [compliances, setCompliances] = useState<NonComplianceControl[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Fetch non-compliance records
  useEffect(() => {
    const fetchCompliances = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/non-compliance');
        if (!response.ok) {
          throw new Error('Failed to fetch non-compliance records');
        }
        const data = await response.json();
        setCompliances(data);
      } catch (error) {
        console.error('Error fetching non-compliance records:', error);
        toast({
          title: 'Error',
          description:
            'Failed to load non-compliance records. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompliances();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/non-compliance/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Failed to delete non-compliance record'
        );
      }

      setCompliances(compliances.filter((compliance) => compliance.id !== id));
      toast({
        title: 'Record deleted',
        description: 'The non-compliance record has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting non-compliance record:', error);
      toast({
        title: 'Error',
        description:
          error.message ||
          'Failed to delete non-compliance record. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Filter compliances based on search query
  const filteredCompliances = compliances.filter(
    (compliance) =>
      compliance.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      compliance.non_compliance_description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      compliance.responsible_person
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      compliance.department?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      false
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredCompliances.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCompliances = filteredCompliances.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search non-compliances...'
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
            {filteredCompliances.length > 0
              ? Math.min(startIndex + 1, filteredCompliances.length)
              : 0}{' '}
            to{' '}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredCompliances.length)}{' '}
            of {filteredCompliances.length} records
          </span>
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <div className='min-w-full'>
          {isLoading ? (
            <div className='flex justify-center items-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <span className='ml-2'>Loading non-compliance records...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[15%]'>Number</TableHead>
                  <TableHead className='w-[15%]'>Department</TableHead>
                  <TableHead className='w-[25%]'>Description</TableHead>
                  <TableHead className='w-[15%]'>Responsible</TableHead>
                  <TableHead className='w-[10%]'>Status</TableHead>
                  <TableHead className='w-[10%]'>Effectiveness</TableHead>
                  <TableHead className='w-[10%] text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCompliances.length > 0 ? (
                  paginatedCompliances.map((compliance) => (
                    <TableRow key={compliance.id}>
                      <TableCell className='font-medium'>
                        {compliance.number}
                      </TableCell>
                      <TableCell>
                        {compliance.department?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className='line-clamp-2'>
                          {compliance.non_compliance_description}
                        </div>
                      </TableCell>
                      <TableCell>{compliance.responsible_person}</TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={getStatusColor(compliance.status)}
                        >
                          {compliance.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={getEffectivenessColor(
                            compliance.effectiveness_evaluation
                          )}
                        >
                          {compliance.effectiveness_evaluation === 'EFFECTIVE'
                            ? 'Effective'
                            : 'Not Effective'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => onEdit(compliance)}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setDeleteId(compliance.id!)}
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
                        ? 'No records match your search'
                        : 'No non-compliance records found'}
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
              non-compliance record.
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
