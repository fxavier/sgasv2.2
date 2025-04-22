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

interface OHSActingListProps {
  onEdit: (entry: OHSActing) => void;
}

const ITEMS_PER_PAGE = 5;

export function OHSActingList({ onEdit }: OHSActingListProps) {
  const [entries, setEntries] = useState<OHSActing[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Fetch OHS acting entries
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/ohs-acting');
        if (!response.ok) {
          throw new Error('Failed to fetch OHS acting entries');
        }
        const data = await response.json();
        setEntries(data);
      } catch (error) {
        console.error('Error fetching OHS acting entries:', error);
        toast({
          title: 'Error',
          description: 'Failed to load OHS acting entries. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/ohs-acting/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete OHS acting entry');
      }

      setEntries(entries.filter((entry) => entry.id !== id));
      toast({
        title: 'Entry deleted',
        description: 'The OHS acting entry has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting OHS acting entry:', error);
      toast({
        title: 'Error',
        description:
          error.message ||
          'Failed to delete OHS acting entry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Filter entries based on search query
  const filteredEntries = entries.filter(
    (entry) =>
      entry.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.designation &&
        entry.designation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEntries = filteredEntries.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search entries...'
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
            {filteredEntries.length > 0
              ? Math.min(startIndex + 1, filteredEntries.length)
              : 0}{' '}
            to {Math.min(startIndex + ITEMS_PER_PAGE, filteredEntries.length)}{' '}
            of {filteredEntries.length} entries
          </span>
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <div className='min-w-full'>
          {isLoading ? (
            <div className='flex justify-center items-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <span className='ml-2'>Loading OHS acting entries...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[20%]'>Full Name</TableHead>
                  <TableHead className='w-[15%]'>Designation</TableHead>
                  <TableHead className='w-[15%]'>Office From</TableHead>
                  <TableHead className='w-[15%]'>Office To</TableHead>
                  <TableHead className='w-[25%]'>Confirmations</TableHead>
                  <TableHead className='w-[10%] text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEntries.length > 0 ? (
                  paginatedEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className='font-medium'>
                        {entry.fullname}
                      </TableCell>
                      <TableCell>{entry.designation || 'N/A'}</TableCell>
                      <TableCell>
                        {entry.terms_of_office_from || 'N/A'}
                      </TableCell>
                      <TableCell>{entry.terms_of_office_to || 'N/A'}</TableCell>
                      <TableCell>
                        <div className='flex flex-wrap gap-1'>
                          {entry.acceptance_confirmation.map((conf) => (
                            <Badge
                              key={conf.id}
                              variant='outline'
                              className='bg-blue-100 text-blue-800'
                            >
                              {conf.description}
                            </Badge>
                          ))}
                          {entry.acceptance_confirmation.length === 0 && (
                            <span className='text-gray-500'>
                              No confirmations
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => onEdit(entry)}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setDeleteId(entry.id!)}
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
                        ? 'No entries match your search'
                        : 'No OHS acting entries found'}
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
              This action cannot be undone. This will permanently delete the OHS
              acting entry.
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
