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

interface ClaimControlListProps {
  onEdit: (claim: ClaimComplainControl) => void;
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

export function ClaimControlList({ onEdit }: ClaimControlListProps) {
  const [claims, setClaims] = useState<ClaimComplainControl[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Fetch claim complain control records
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/claim-complain');
        if (!response.ok) {
          throw new Error('Failed to fetch claim complain control records');
        }
        const data = await response.json();
        setClaims(data);
      } catch (error) {
        console.error('Error fetching claim complain control records:', error);
        toast({
          title: 'Error',
          description:
            'Failed to load claim complain control records. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClaims();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/claim-complain/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Failed to delete claim complain control record'
        );
      }

      setClaims(claims.filter((claim) => claim.id !== id));
      toast({
        title: 'Record deleted',
        description:
          'The claim complain control record has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting claim complain control record:', error);
      toast({
        title: 'Error',
        description:
          error.message ||
          'Failed to delete claim complain control record. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Filter claims based on search query
  const filteredClaims = claims.filter(
    (claim) =>
      claim.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.claim_complain_submitted_by
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      claim.claim_complain_description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      claim.claim_complain_responsible_person
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredClaims.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedClaims = filteredClaims.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search claims...'
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
            {filteredClaims.length > 0
              ? Math.min(startIndex + 1, filteredClaims.length)
              : 0}{' '}
            to {Math.min(startIndex + ITEMS_PER_PAGE, filteredClaims.length)} of{' '}
            {filteredClaims.length} records
          </span>
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <div className='min-w-full'>
          {isLoading ? (
            <div className='flex justify-center items-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <span className='ml-2'>
                Loading claim complain control records...
              </span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[15%]'>Number</TableHead>
                  <TableHead className='w-[15%]'>Submitted By</TableHead>
                  <TableHead className='w-[25%]'>Description</TableHead>
                  <TableHead className='w-[15%]'>Responsible</TableHead>
                  <TableHead className='w-[10%]'>Status</TableHead>
                  <TableHead className='w-[10%]'>Deadline</TableHead>
                  <TableHead className='w-[10%] text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedClaims.length > 0 ? (
                  paginatedClaims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell className='font-medium'>
                        {claim.number}
                      </TableCell>
                      <TableCell>{claim.claim_complain_submitted_by}</TableCell>
                      <TableCell>
                        <div className='line-clamp-2'>
                          {claim.claim_complain_description}
                        </div>
                      </TableCell>
                      <TableCell>
                        {claim.claim_complain_responsible_person}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={getStatusColor(
                            claim.claim_complain_status
                          )}
                        >
                          {claim.claim_complain_status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(
                          claim.claim_complain_deadline
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => onEdit(claim)}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setDeleteId(claim.id!)}
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
                        : 'No claim complain control records found'}
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
              claim complain control record.
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
