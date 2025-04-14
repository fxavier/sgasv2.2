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
import { Pencil, Trash2, Search, FileText, Loader2 } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface DocumentTypeListProps {
  onEdit: (type: DocumentType) => void;
}

const ITEMS_PER_PAGE = 5;

const getStateColor = (state: string) => {
  const colors = {
    REVISION: 'bg-yellow-100 text-yellow-800',
    INUSE: 'bg-green-100 text-green-800',
    OBSOLETE: 'bg-red-100 text-red-800',
  };
  return colors[state as keyof typeof colors] || colors.REVISION;
};

export function DocumentTypeList({ onEdit }: DocumentTypeListProps) {
  const [types, setTypes] = useState<DocumentType[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingType, setViewingType] = useState<DocumentType | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Fetch document types
  const fetchDocumentTypes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/document-types');
      if (!response.ok) {
        throw new Error('Failed to fetch document types');
      }
      const data = await response.json();
      setTypes(data);
    } catch (error) {
      console.error('Error fetching document types:', error);
      toast({
        title: 'Error',
        description: 'Failed to load document types. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch documents for a specific type
  const fetchDocumentsForType = async (typeId: string) => {
    try {
      const response = await fetch(`/api/documents?typeId=${typeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load documents. Please try again.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  useEffect(() => {
    if (viewingType) {
      fetchDocumentsForType(viewingType.id!);
    }
  }, [viewingType]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/document-types/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete document type');
      }

      setTypes(types.filter((type) => type.id !== id));
      toast({
        title: 'Document type deleted',
        description: 'The document type has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting document type:', error);
      toast({
        title: 'Error',
        description:
          error.message || 'Failed to delete document type. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Filter types based on search query
  const filteredTypes = types.filter((type) =>
    type.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredTypes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTypes = filteredTypes.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <>
      <div className='space-y-4'>
        <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
          <div className='relative w-full sm:w-96'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <Input
              placeholder='Search document types...'
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
              {filteredTypes.length > 0
                ? Math.min(startIndex + 1, filteredTypes.length)
                : 0}{' '}
              to {Math.min(startIndex + ITEMS_PER_PAGE, filteredTypes.length)}{' '}
              of {filteredTypes.length} types
            </span>
          </div>
        </div>

        <div className='rounded-md border bg-white shadow-sm'>
          <div className='min-w-full'>
            {isLoading ? (
              <div className='flex justify-center items-center p-8'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
                <span className='ml-2'>Loading document types...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[60%]'>Description</TableHead>
                    <TableHead className='w-[20%] text-right'>
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTypes.length > 0 ? (
                    paginatedTypes.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell className='font-medium'>
                          {type.description}
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center justify-end gap-1'>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => setViewingType(type)}
                              title='View Documents'
                            >
                              <FileText className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => onEdit(type)}
                              title='Edit'
                            >
                              <Pencil className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => setDeleteId(type.id!)}
                              title='Delete'
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
                        colSpan={3}
                        className='text-center py-8 text-gray-500'
                      >
                        {searchQuery
                          ? 'No document types match your search'
                          : 'No document types found'}
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
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => !isDeleting && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              document type.
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

      {/* View Documents Dialog */}
      <Dialog
        open={viewingType !== null}
        onOpenChange={(open) => !open && setViewingType(null)}
      >
        <DialogContent className='sm:max-w-[800px]'>
          <DialogHeader>
            <DialogTitle>
              Documents of type: {viewingType?.description}
            </DialogTitle>
          </DialogHeader>
          <div className='mt-4'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[20%]'>Code</TableHead>
                  <TableHead className='w-[40%]'>Name</TableHead>
                  <TableHead className='w-[20%]'>State</TableHead>
                  <TableHead className='w-[20%]'>Revision Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className='font-medium'>{doc.code}</TableCell>
                      <TableCell>{doc.document_name}</TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={getStateColor(doc.document_state)}
                        >
                          {doc.document_state.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(doc.revision_date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className='text-center text-gray-500'
                    >
                      No documents found for this type
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
