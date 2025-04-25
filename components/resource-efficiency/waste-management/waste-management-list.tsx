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

interface WasteManagementListProps {
  onEdit: (waste: WasteManagement) => void;
}

const ITEMS_PER_PAGE = 5;

export function WasteManagementList({ onEdit }: WasteManagementListProps) {
  const [wasteManagements, setWasteManagements] = useState<WasteManagement[]>(
    []
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Fetch waste management records
  useEffect(() => {
    const fetchWasteManagements = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/waste-management');
        if (!response.ok) {
          throw new Error('Failed to fetch waste management records');
        }
        const data = await response.json();
        setWasteManagements(data);
      } catch (error) {
        console.error('Error fetching waste management records:', error);
        toast({
          title: 'Error',
          description:
            'Failed to load waste management records. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWasteManagements();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/waste-management/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Failed to delete waste management record'
        );
      }

      setWasteManagements(wasteManagements.filter((waste) => waste.id !== id));
      toast({
        title: 'Record deleted',
        description:
          'The waste management record has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting waste management record:', error);
      toast({
        title: 'Error',
        description:
          error.message ||
          'Failed to delete waste management record. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Filter waste management records based on search query
  const filteredWasteManagements = wasteManagements.filter(
    (waste) =>
      waste.waste_route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      waste.labelling.toLowerCase().includes(searchQuery.toLowerCase()) ||
      waste.disposal_company
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      waste.transportation_company_method
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(
    filteredWasteManagements.length / ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedWasteManagements = filteredWasteManagements.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search waste management...'
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
            {filteredWasteManagements.length > 0
              ? Math.min(startIndex + 1, filteredWasteManagements.length)
              : 0}{' '}
            to{' '}
            {Math.min(
              startIndex + ITEMS_PER_PAGE,
              filteredWasteManagements.length
            )}{' '}
            of {filteredWasteManagements.length} records
          </span>
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <div className='min-w-full'>
          {isLoading ? (
            <div className='flex justify-center items-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <span className='ml-2'>Loading waste management records...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[15%]'>Waste Route</TableHead>
                  <TableHead className='w-[15%]'>Labelling</TableHead>
                  <TableHead className='w-[15%]'>Storage</TableHead>
                  <TableHead className='w-[20%]'>Transportation</TableHead>
                  <TableHead className='w-[15%]'>Disposal Company</TableHead>
                  <TableHead className='w-[10%]'>Created</TableHead>
                  <TableHead className='w-[10%] text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedWasteManagements.length > 0 ? (
                  paginatedWasteManagements.map((waste) => (
                    <TableRow key={waste.id}>
                      <TableCell className='font-medium'>
                        {waste.waste_route}
                      </TableCell>
                      <TableCell>{waste.labelling}</TableCell>
                      <TableCell>{waste.storage}</TableCell>
                      <TableCell>
                        {waste.transportation_company_method}
                      </TableCell>
                      <TableCell>{waste.disposal_company}</TableCell>
                      <TableCell>
                        {new Date(waste.created_at!).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => onEdit(waste)}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setDeleteId(waste.id!)}
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
                        : 'No waste management records found'}
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
              waste management record.
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
