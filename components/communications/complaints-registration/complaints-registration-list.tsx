'use client';

import { useState, useEffect } from 'react';
import { ComplaintAndClaimRecord } from '@/components/communications/complaints-registration/complaints-registration-form';
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

interface ComplaintsRegistrationListProps {
  onEdit: (complaint: ComplaintAndClaimRecord) => void;
}

const ITEMS_PER_PAGE = 5;

const getClaimCategoryColor = (category: string) => {
  const colors = {
    Odor: 'bg-purple-100 text-purple-800',
    Noise: 'bg-blue-100 text-blue-800',
    Effluents: 'bg-green-100 text-green-800',
    'Company vehicles': 'bg-yellow-100 text-yellow-800',
    'Flow of migrant workers': 'bg-orange-100 text-orange-800',
    'Security personnel': 'bg-red-100 text-red-800',
    'GBV/SA/SEA': 'bg-pink-100 text-pink-800',
    Other: 'bg-gray-100 text-gray-800',
  };
  return colors[category as keyof typeof colors] || colors.Other;
};

const getSatisfactionColor = (satisfaction: string) => {
  return satisfaction === 'SATISFIED'
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800';
};

export function ComplaintsRegistrationList({
  onEdit,
}: ComplaintsRegistrationListProps) {
  const [complaints, setComplaints] = useState<ComplaintAndClaimRecord[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Fetch complaints and claims
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/complaints-registration');
        if (!response.ok) {
          throw new Error('Failed to fetch complaints and claims');
        }
        const data = await response.json();
        setComplaints(data);
      } catch (error) {
        console.error('Error fetching complaints and claims:', error);
        toast({
          title: 'Error',
          description:
            'Failed to load complaints and claims. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/complaints-registration/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Failed to delete complaint and claim record'
        );
      }

      setComplaints(complaints.filter((complaint) => complaint.id !== id));
      toast({
        title: 'Record deleted',
        description:
          'The complaint and claim record has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting complaint and claim record:', error);
      toast({
        title: 'Error',
        description:
          error.message ||
          'Failed to delete complaint and claim record. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Filter complaints based on search query
  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaint.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.local_occurrence
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      complaint.who_involved
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (complaint.claim_category &&
        complaint.claim_category
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedComplaints = filteredComplaints.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search complaints...'
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
            {filteredComplaints.length > 0
              ? Math.min(startIndex + 1, filteredComplaints.length)
              : 0}{' '}
            to{' '}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredComplaints.length)}{' '}
            of {filteredComplaints.length} records
          </span>
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <div className='min-w-full'>
          {isLoading ? (
            <div className='flex justify-center items-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <span className='ml-2'>Loading complaints and claims...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[15%]'>Number</TableHead>
                  <TableHead className='w-[15%]'>Location</TableHead>
                  <TableHead className='w-[15%]'>Who Involved</TableHead>
                  <TableHead className='w-[15%]'>Category</TableHead>
                  <TableHead className='w-[15%]'>Resolution</TableHead>
                  <TableHead className='w-[15%]'>Satisfaction</TableHead>
                  <TableHead className='w-[10%] text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedComplaints.length > 0 ? (
                  paginatedComplaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className='font-medium'>
                        {complaint.number}
                      </TableCell>
                      <TableCell>{complaint.local_occurrence}</TableCell>
                      <TableCell>{complaint.who_involved}</TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={getClaimCategoryColor(
                            complaint.claim_category
                          )}
                        >
                          {complaint.claim_category}
                        </Badge>
                      </TableCell>
                      <TableCell>{complaint.resolution_type}</TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={getSatisfactionColor(
                            complaint.complaintant_satisfaction
                          )}
                        >
                          {complaint.complaintant_satisfaction === 'SATISFIED'
                            ? 'Satisfied'
                            : 'Not Satisfied'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => onEdit(complaint)}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setDeleteId(complaint.id)}
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
                        : 'No complaint and claim records found'}
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
              complaint and claim record.
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
