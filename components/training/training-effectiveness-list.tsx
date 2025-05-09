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

interface TrainingEffectivenessListProps {
  onEdit: (assessment: TrainingEffectivnessAssessment) => void;
}

const ITEMS_PER_PAGE = 5;

const getAnswerColor = (answer: string) => {
  const colors = {
    Satisfactory: 'bg-green-100 text-green-800',
    'Partially Satisfactory': 'bg-yellow-100 text-yellow-800',
    Unsatisfactory: 'bg-red-100 text-red-800',
  };
  return colors[answer as keyof typeof colors] || colors.Unsatisfactory;
};

const getEvaluationColor = (evaluation: string) => {
  return evaluation === 'effective'
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800';
};

export function TrainingEffectivenessAssessmentList({
  onEdit,
}: TrainingEffectivenessListProps) {
  const [assessments, setAssessments] = useState<
    TrainingEffectivnessAssessment[]
  >([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Fetch training effectiveness assessments
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/training-effectiveness');
        if (!response.ok) {
          throw new Error('Failed to fetch training effectiveness assessments');
        }
        const data = await response.json();
        setAssessments(data);
      } catch (error) {
        console.error('Error fetching assessments:', error);
        toast({
          title: 'Error',
          description:
            'Failed to load training effectiveness assessments. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessments();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/training-effectiveness/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete assessment');
      }

      setAssessments(assessments.filter((assessment) => assessment.id !== id));
      toast({
        title: 'Assessment deleted',
        description:
          'The training effectiveness assessment has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting assessment:', error);
      toast({
        title: 'Error',
        description:
          error.message || 'Failed to delete assessment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Filter assessments based on search query
  const filteredAssessments = assessments.filter(
    (assessment) =>
      assessment.training.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.trainee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.department?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      false
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredAssessments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAssessments = filteredAssessments.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search assessments...'
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
            {filteredAssessments.length > 0
              ? Math.min(startIndex + 1, filteredAssessments.length)
              : 0}{' '}
            to{' '}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredAssessments.length)}{' '}
            of {filteredAssessments.length} assessments
          </span>
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <div className='min-w-full'>
          {isLoading ? (
            <div className='flex justify-center items-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <span className='ml-2'>Loading assessments...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[20%]'>Training</TableHead>
                  <TableHead className='w-[15%]'>Trainee</TableHead>
                  <TableHead className='w-[15%]'>Department</TableHead>
                  <TableHead className='w-[15%]'>Answer</TableHead>
                  <TableHead className='w-[15%]'>HR Evaluation</TableHead>
                  <TableHead className='w-[10%]'>Date</TableHead>
                  <TableHead className='w-[10%] text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAssessments.length > 0 ? (
                  paginatedAssessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className='font-medium'>
                        {assessment.training}
                      </TableCell>
                      <TableCell>{assessment.trainee}</TableCell>
                      <TableCell>
                        {assessment.department?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={getAnswerColor(assessment.answer)}
                        >
                          {assessment.answer}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={getEvaluationColor(
                            assessment.human_resource_evaluation
                          )}
                        >
                          {assessment.human_resource_evaluation}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(assessment.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => onEdit(assessment)}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setDeleteId(assessment.id!)}
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
                        ? 'No assessments match your search'
                        : 'No assessments found'}
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
              training effectiveness assessment.
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
