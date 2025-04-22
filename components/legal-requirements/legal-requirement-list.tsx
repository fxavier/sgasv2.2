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
import {
  Pencil,
  Trash2,
  Search,
  FileText,
  Download,
  Loader2,
} from 'lucide-react';
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

interface LegalRequirementListProps {
  onEdit: (requirement: LegalRequirement) => void;
}

const ITEMS_PER_PAGE = 5;

const getStatusColor = (status: string) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    expired: 'bg-red-100 text-red-800',
  };
  return colors[status as keyof typeof colors] || colors.inactive;
};

export function LegalRequirementList({ onEdit }: LegalRequirementListProps) {
  const [requirements, setRequirements] = useState<LegalRequirement[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Fetch legal requirements
  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/risks/legal-requirements');
        if (!response.ok) {
          throw new Error('Failed to fetch legal requirements');
        }
        const data = await response.json();
        setRequirements(data);
      } catch (error) {
        console.error('Error fetching legal requirements:', error);
        toast({
          title: 'Error',
          description: 'Failed to load legal requirements. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequirements();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/risks/legal-requirements/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Failed to delete legal requirement'
        );
      }

      setRequirements(requirements.filter((req) => req.id !== id));
      toast({
        title: 'Requirement deleted',
        description: 'The legal requirement has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting legal requirement:', error);
      toast({
        title: 'Error',
        description:
          error.message ||
          'Failed to delete legal requirement. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleDownload = async (lawFile: string) => {
    try {
      const response = await fetch(lawFile);
      if (!response.ok) throw new Error('Failed to download file');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = lawFile.split('/').pop() || 'law-file';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to download law file. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Filter requirements based on search query
  const filteredRequirements = requirements.filter(
    (req) =>
      req.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.document_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredRequirements.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRequirements = filteredRequirements.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search requirements...'
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
            {filteredRequirements.length > 0
              ? Math.min(startIndex + 1, filteredRequirements.length)
              : 0}{' '}
            to{' '}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredRequirements.length)}{' '}
            of {filteredRequirements.length} requirements
          </span>
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <div className='min-w-full'>
          {isLoading ? (
            <div className='flex justify-center items-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <span className='ml-2'>Loading legal requirements...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[15%]'>Number</TableHead>
                  <TableHead className='w-[20%]'>Document Title</TableHead>
                  <TableHead className='w-[15%]'>Effective Date</TableHead>
                  <TableHead className='w-[10%]'>Status</TableHead>
                  <TableHead className='w-[30%]'>Description</TableHead>
                  <TableHead className='w-[10%] text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRequirements.length > 0 ? (
                  paginatedRequirements.map((requirement) => (
                    <TableRow key={requirement.id}>
                      <TableCell className='font-medium break-words'>
                        {requirement.number}
                      </TableCell>
                      <TableCell className='break-words'>
                        {requirement.document_title}
                      </TableCell>
                      <TableCell>
                        {new Date(
                          requirement.effective_date
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={getStatusColor(requirement.status)}
                        >
                          {requirement.status.charAt(0).toUpperCase() +
                            requirement.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className='break-words'>
                        <div className='line-clamp-2'>
                          {requirement.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => onEdit(requirement)}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setDeleteId(requirement.id!)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                          {requirement.law_file && (
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() =>
                                handleDownload(requirement.law_file!)
                              }
                            >
                              <Download className='h-4 w-4' />
                            </Button>
                          )}
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
                        ? 'No requirements match your search'
                        : 'No legal requirements found'}
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
              legal requirement.
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
