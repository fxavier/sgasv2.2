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

interface IncidentFlashReportListProps {
  onEdit: (report: IncidentFlashReport) => void;
}

const ITEMS_PER_PAGE = 5;

const getInvestigationColor = (required: string) => {
  return required === 'Yes'
    ? 'bg-yellow-100 text-yellow-800'
    : 'bg-green-100 text-green-800';
};

const getReportableColor = (reportable: string) => {
  return reportable === 'Yes'
    ? 'bg-red-100 text-red-800'
    : 'bg-green-100 text-green-800';
};

export function IncidentFlashReportList({
  onEdit,
}: IncidentFlashReportListProps) {
  const [reports, setReports] = useState<IncidentFlashReport[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Fetch incident flash reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/incident-flash-reports');
        if (!response.ok) {
          throw new Error('Failed to fetch incident flash reports');
        }
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error('Error fetching incident flash reports:', error);
        toast({
          title: 'Error',
          description:
            'Failed to load incident flash reports. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/incident-flash-reports/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Failed to delete incident flash report'
        );
      }

      setReports(reports.filter((report) => String(report.id) !== id));
      toast({
        title: 'Report deleted',
        description: 'The incident flash report has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting incident flash report:', error);
      toast({
        title: 'Error',
        description:
          error.message ||
          'Failed to delete incident flash report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Filter reports based on search query
  const filteredReports = reports.filter(
    (report) =>
      report.location_incident
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      report.supervisor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.incident_description
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedReports = filteredReports.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search reports...'
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
            {filteredReports.length > 0
              ? Math.min(startIndex + 1, filteredReports.length)
              : 0}{' '}
            to {Math.min(startIndex + ITEMS_PER_PAGE, filteredReports.length)}{' '}
            of {filteredReports.length} reports
          </span>
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <div className='min-w-full'>
          {isLoading ? (
            <div className='flex justify-center items-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <span className='ml-2'>Loading incident flash reports...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[15%]'>Date/Time</TableHead>
                  <TableHead className='w-[15%]'>Location</TableHead>
                  <TableHead className='w-[15%]'>Supervisor</TableHead>
                  <TableHead className='w-[20%]'>Description</TableHead>
                  <TableHead className='w-[10%]'>Investigation</TableHead>
                  <TableHead className='w-[10%]'>Reportable</TableHead>
                  <TableHead className='w-[15%] text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReports.length > 0 ? (
                  paginatedReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        {new Date(report.date_incident).toLocaleDateString()}
                        <br />
                        <span className='text-sm text-gray-500'>
                          {new Date(report.time_incident).toLocaleTimeString(
                            [],
                            { hour: '2-digit', minute: '2-digit' }
                          )}
                        </span>
                      </TableCell>
                      <TableCell>{report.location_incident}</TableCell>
                      <TableCell>{report.supervisor}</TableCell>
                      <TableCell>
                        <div className='line-clamp-2'>
                          {report.incident_description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={getInvestigationColor(
                            report.further_investigation_required
                          )}
                        >
                          {report.further_investigation_required}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={getReportableColor(
                            report.incident_reportable
                          )}
                        >
                          {report.incident_reportable}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => onEdit(report)}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() =>
                              setDeleteId(report.id?.toString() || null)
                            }
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
                        ? 'No reports match your search'
                        : 'No incident flash reports found'}
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
              incident flash report.
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
