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
  Loader2,
  Plus,
  Image,
  FileText,
  ExternalLink,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define the PhotoDocumentProvingClosure interface
interface PhotoDocumentProvingClosure {
  id?: string;
  photo: string;
  document: string;
  createdBy: string;
  created_at?: string;
  updated_at?: string;
}

const formSchema = z.object({
  photo: z
    .any()
    .refine(
      (file) => !file || (file instanceof File && file.size > 0),
      'Photo is required when creating a new record'
    ),
  document: z
    .any()
    .refine(
      (file) => !file || (file instanceof File && file.size > 0),
      'Document is required when creating a new record'
    ),
  createdBy: z.string().min(2, 'Creator name must be at least 2 characters'),
});

export default function PhotoDocumentClosurePage() {
  const [documents, setDocuments] = useState<PhotoDocumentProvingClosure[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDocument, setEditingDocument] =
    useState<PhotoDocumentProvingClosure | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photo: undefined,
      document: undefined,
      createdBy: '',
    },
  });

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/photo-document-closure');

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch documents. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update form when editing a document
  useEffect(() => {
    if (editingDocument) {
      form.reset({
        photo: undefined, // Clear file input
        document: undefined, // Clear file input
        createdBy: editingDocument.createdBy,
      });
    } else {
      form.reset({
        photo: undefined,
        document: undefined,
        createdBy: '',
      });
    }
  }, [editingDocument, form]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/photo-document-closure?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      setDocuments(documents.filter((doc) => doc.id !== id));
      toast({
        title: 'Document deleted',
        description: 'The photo/document has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      if (editingDocument?.id) {
        formData.append('id', editingDocument.id);
      }

      formData.append('createdBy', values.createdBy);

      // For editing, check if new files are provided
      if (values.photo instanceof File) {
        formData.append('photo', values.photo);
      } else if (editingDocument) {
        // If editing and no new photo, keep the existing URL
        formData.append('currentPhotoUrl', editingDocument.photo);
      }

      if (values.document instanceof File) {
        formData.append('document', values.document);
      } else if (editingDocument) {
        // If editing and no new document, keep the existing URL
        formData.append('currentDocumentUrl', editingDocument.document);
      }

      const url = '/api/photo-document-closure';
      const method = editingDocument ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${editingDocument ? 'update' : 'create'} document`
        );
      }

      const data = await response.json();

      if (editingDocument) {
        setDocuments(
          documents.map((doc) => (doc.id === editingDocument.id ? data : doc))
        );

        toast({
          title: 'Document updated',
          description: 'The photo/document has been successfully updated.',
        });
      } else {
        setDocuments([data, ...documents]);

        toast({
          title: 'Document created',
          description: 'The photo/document has been successfully created.',
        });
      }

      // Close the form and reset
      setIsFormOpen(false);
      setEditingDocument(null);
      form.reset();
    } catch (error) {
      console.error('Error saving document:', error);
      toast({
        title: 'Error',
        description:
          'There was an error saving the document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter documents based on search query
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.photo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.document.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='container mx-auto max-w-7xl px-4 py-6 space-y-8'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Photo and Document Proving Closure
          </h1>
          <p className='text-gray-500 mt-2'>
            Manage photos and documents that prove case closure
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingDocument(null);
            setIsFormOpen(true);
          }}
          className='flex items-center gap-2 w-full sm:w-auto'
        >
          <Plus className='h-4 w-4' />
          Add Photo/Document
        </Button>
      </div>

      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search documents...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <div className='min-w-full'>
          {isLoading ? (
            <div className='flex justify-center items-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <span className='ml-2'>Loading documents...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[20%]'>Created By</TableHead>
                  <TableHead className='w-[25%]'>Photo</TableHead>
                  <TableHead className='w-[25%]'>Document</TableHead>
                  <TableHead className='w-[15%]'>Created At</TableHead>
                  <TableHead className='w-[15%] text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className='font-medium'>
                        {doc.createdBy}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Image className='h-4 w-4 text-blue-500' />
                          <a
                            href={doc.photo}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-500 hover:underline flex items-center'
                          >
                            View Photo
                            <ExternalLink className='h-3 w-3 ml-1' />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <FileText className='h-4 w-4 text-blue-500' />
                          <a
                            href={doc.document}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-500 hover:underline flex items-center'
                          >
                            View Document
                            <ExternalLink className='h-3 w-3 ml-1' />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        {doc.created_at
                          ? new Date(doc.created_at).toLocaleDateString()
                          : ''}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                              setEditingDocument(doc);
                              setIsFormOpen(true);
                            }}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => doc.id && setDeleteId(doc.id)}
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
                      colSpan={5}
                      className='text-center py-8 text-gray-500'
                    >
                      No documents found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Document Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>
              {editingDocument ? 'Edit Photo/Document' : 'Add Photo/Document'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='photo'
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>
                      {editingDocument
                        ? 'Photo (Leave empty to keep current)'
                        : 'Photo'}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='file'
                        accept='image/*'
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          onChange(file || null);
                        }}
                        {...fieldProps}
                      />
                    </FormControl>
                    {editingDocument && (
                      <div className='text-sm text-blue-500 mt-1'>
                        <a
                          href={editingDocument.photo}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center gap-1'
                        >
                          Current photo
                          <ExternalLink className='h-3 w-3' />
                        </a>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='document'
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>
                      {editingDocument
                        ? 'Document (Leave empty to keep current)'
                        : 'Document'}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='file'
                        accept='.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          onChange(file || null);
                        }}
                        {...fieldProps}
                      />
                    </FormControl>
                    {editingDocument && (
                      <div className='text-sm text-blue-500 mt-1'>
                        <a
                          href={editingDocument.document}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center gap-1'
                        >
                          Current document
                          <ExternalLink className='h-3 w-3' />
                        </a>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='createdBy'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Created By</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter creator name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex justify-end gap-4 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingDocument(null);
                    form.reset();
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      {editingDocument ? 'Updating...' : 'Creating...'}
                    </>
                  ) : editingDocument ? (
                    'Update'
                  ) : (
                    'Create'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeleteId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              photo/document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) handleDelete(deleteId);
              }}
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
