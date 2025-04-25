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
import { format } from 'date-fns';
import { WasteTransferLog } from './waste-transfer-log-form';

interface WasteTransferLogListProps {
  onEdit: (log: WasteTransferLog) => void;
  refreshKey: number; // Added to trigger refreshes
}

const ITEMS_PER_PAGE = 5;

export function WasteTransferLogList({
  onEdit,
  refreshKey,
}: WasteTransferLogListProps) {
  const [logs, setLogs] = useState<WasteTransferLog[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Fetch logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/waste-transfer-log');
        if (!response.ok) {
          throw new Error('Failed to fetch waste transfer logs');
        }
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error('Error fetching waste transfer logs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load waste transfer logs. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [toast, refreshKey]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/waste-transfer-log?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Failed to delete waste transfer log'
        );
      }

      setLogs(logs.filter((log) => log.id !== id));
      toast({
        title: 'Log deleted',
        description: 'The waste transfer log has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting waste transfer log:', error);
      toast({
        title: 'Error',
        description:
          error.message ||
          'Failed to delete waste transfer log. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Filter logs based on search query
  const filteredLogs = logs.filter(
    (log) =>
      log.wasteType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.transferCompany.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLogs = filteredLogs.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search logs...'
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
            {filteredLogs.length > 0
              ? Math.min(startIndex + 1, filteredLogs.length)
              : 0}{' '}
            to {Math.min(startIndex + ITEMS_PER_PAGE, filteredLogs.length)} of{' '}
            {filteredLogs.length} logs
          </span>
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <div className='min-w-full'>
          {isLoading ? (
            <div className='flex justify-center items-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <span className='ml-2'>Loading waste transfer logs...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[15%]'>Reference</TableHead>
                  <TableHead className='w-[15%]'>Waste Type</TableHead>
                  <TableHead className='w-[15%]'>Containment</TableHead>
                  <TableHead className='w-[10%]'>Amount</TableHead>
                  <TableHead className='w-[15%]'>Company</TableHead>
                  <TableHead className='w-[20%]'>Instructions</TableHead>
                  <TableHead className='w-[10%] text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.length > 0 ? (
                  paginatedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className='font-medium'>
                        {log.referenceNumber}
                      </TableCell>
                      <TableCell>{log.wasteType}</TableCell>
                      <TableCell>{log.howIsWasteContained}</TableCell>
                      <TableCell>{log.howMuchWaste}</TableCell>
                      <TableCell>{log.transferCompany}</TableCell>
                      <TableCell>
                        <div className='line-clamp-2'>
                          {log.specialInstructions}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => onEdit(log)}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setDeleteId(log.id)}
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
                        : 'No waste transfer logs found'}
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
              waste transfer log.
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
