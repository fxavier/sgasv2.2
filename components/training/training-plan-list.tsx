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

interface TrainingPlanListProps {
  onEdit: (plan: TrainingPlan) => void;
}

const ITEMS_PER_PAGE = 5;

const getStatusColor = (status: string) => {
  return status === 'Completed'
    ? 'bg-green-100 text-green-800'
    : 'bg-blue-100 text-blue-800';
};

const getTypeColor = (type: string) => {
  return type === 'Internal'
    ? 'bg-purple-100 text-purple-800'
    : 'bg-orange-100 text-orange-800';
};

export function TrainingPlanList({ onEdit }: TrainingPlanListProps) {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Fetch training plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/training-plans');
        if (!response.ok) {
          throw new Error('Failed to fetch training plans');
        }
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error('Error fetching training plans:', error);
        toast({
          title: 'Error',
          description: 'Failed to load training plans. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/training-plans/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete training plan');
      }

      setPlans(plans.filter((plan) => plan.id !== id));
      toast({
        title: 'Training plan deleted',
        description: 'The training plan has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting training plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete training plan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Filter plans based on search query
  const filteredPlans = plans.filter(
    (plan) =>
      plan.training_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.training_area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.updated_by.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.training_entity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredPlans.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPlans = filteredPlans.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search training plans...'
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
            {filteredPlans.length > 0
              ? Math.min(startIndex + 1, filteredPlans.length)
              : 0}{' '}
            to {Math.min(startIndex + ITEMS_PER_PAGE, filteredPlans.length)} of{' '}
            {filteredPlans.length} plans
          </span>
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <div className='min-w-full'>
          {isLoading ? (
            <div className='flex justify-center items-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <span className='ml-2'>Loading training plans...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[20%]'>Title</TableHead>
                  <TableHead className='w-[15%]'>Area</TableHead>
                  <TableHead className='w-[10%]'>Type</TableHead>
                  <TableHead className='w-[15%]'>Month</TableHead>
                  <TableHead className='w-[10%]'>Status</TableHead>
                  <TableHead className='w-[20%]'>Recipients</TableHead>
                  <TableHead className='w-[10%] text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPlans.length > 0 ? (
                  paginatedPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className='font-medium'>
                        {plan.training_title}
                      </TableCell>
                      <TableCell>{plan.training_area}</TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={getTypeColor(plan.training_type)}
                        >
                          {plan.training_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{plan.training_month}</TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={getStatusColor(plan.training_status)}
                        >
                          {plan.training_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className='line-clamp-2'>
                          {plan.training_recipients}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => onEdit(plan)}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setDeleteId(plan.id!)}
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
                        ? 'No training plans match your search'
                        : 'No training plans found'}
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
              training plan.
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
