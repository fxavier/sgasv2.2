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

interface FirstAidKitChecklistListProps {
  onEdit: (checklist: FirstAidKitChecklist) => void;
}

const ITEMS_PER_PAGE = 5;

export function FirstAidKitChecklistList({
  onEdit,
}: FirstAidKitChecklistListProps) {
  const [checklists, setChecklists] = useState<FirstAidKitChecklist[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Fetch first aid kit checklists
  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/first-aid-checklist');
        if (!response.ok) {
          throw new Error('Failed to fetch first aid kit checklists');
        }
        const data = await response.json();
        setChecklists(data);
      } catch (error) {
        console.error('Error fetching checklists:', error);
        toast({
          title: 'Error',
          description:
            'Failed to load first aid kit checklists. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchChecklists();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/first-aid-checklist/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete checklist item');
      }

      setChecklists(
        checklists.filter((checklist) => String(checklist.id) !== id)
      );
      toast({
        title: 'Checklist item deleted',
        description:
          'The first aid kit checklist item has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting checklist item:', error);
      toast({
        title: 'Error',
        description:
          error.message || 'Failed to delete checklist item. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Filter checklists based on search query
  const filteredChecklists = checklists.filter(
    (checklist) =>
      checklist.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
      checklist.inspecao_realizada_por
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredChecklists.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedChecklists = filteredChecklists.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Function to check if an item is expired
  const isExpired = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search checklists...'
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
            {filteredChecklists.length > 0
              ? Math.min(startIndex + 1, filteredChecklists.length)
              : 0}{' '}
            to{' '}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredChecklists.length)}{' '}
            of {filteredChecklists.length} items
          </span>
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <div className='min-w-full'>
          {isLoading ? (
            <div className='flex justify-center items-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <span className='ml-2'>Loading first aid kit checklists...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[25%]'>Description</TableHead>
                  <TableHead className='w-[10%]'>Quantity</TableHead>
                  <TableHead className='w-[15%]'>Date</TableHead>
                  <TableHead className='w-[15%]'>Deadline</TableHead>
                  <TableHead className='w-[20%]'>Inspector</TableHead>
                  <TableHead className='w-[15%] text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedChecklists.length > 0 ? (
                  paginatedChecklists.map((checklist) => (
                    <TableRow key={checklist.id}>
                      <TableCell className='font-medium'>
                        {checklist.descricao}
                      </TableCell>
                      <TableCell>{checklist.quantidade}</TableCell>
                      <TableCell>
                        {new Date(checklist.data).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center'>
                          <span className='mr-2'>
                            {new Date(checklist.prazo).toLocaleDateString()}
                          </span>
                          {isExpired(checklist.prazo) && (
                            <Badge variant='destructive' className='text-xs'>
                              Expired
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{checklist.inspecao_realizada_por}</TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => onEdit(checklist)}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                              setDeleteId(checklist.id!.toString());
                            }}
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
                        ? 'No checklist items match your search'
                        : 'No first aid kit checklist items found'}
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
              first aid kit checklist item.
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
