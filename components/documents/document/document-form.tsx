'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Upload,
  Loader2,
  FileIcon,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useRef, useState, useEffect } from 'react';
import { uploadFileToS3 } from '@/lib/upload-service';

const formSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  creation_date: z.string(),
  revision_date: z.string(),
  document_name: z
    .string()
    .min(2, 'Document name must be at least 2 characters'),
  document_type: z.object({
    id: z.string(),
    description: z.string(),
  }),
  document_path: z.string().optional(),
  document_state: z.enum(['REVISION', 'INUSE', 'OBSOLETE']),
  retention_period: z.string(),
  disposal_method: z
    .string()
    .min(2, 'Disposal method must be at least 2 characters'),
  observation: z.string(),
});

interface DocumentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function DocumentForm({
  open,
  onOpenChange,
  document,
  onClose,
  onSuccess,
}: DocumentFormProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>('');

  // Fetch document types
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/document-types');
        if (!response.ok) {
          throw new Error('Failed to fetch document types');
        }
        const data = await response.json();
        setDocumentTypes(data);
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

    if (open) {
      fetchDocumentTypes();
    }
  }, [open, toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: document?.code || '',
      creation_date:
        document?.creation_date || format(new Date(), 'yyyy-MM-dd'),
      revision_date:
        document?.revision_date || format(new Date(), 'yyyy-MM-dd'),
      document_name: document?.document_name || '',
      document_type: document?.document_type || undefined,
      document_path: document?.document_path || '',
      document_state: document?.document_state || 'REVISION',
      retention_period:
        document?.retention_period || format(new Date(), 'yyyy-MM-dd'),
      disposal_method: document?.disposal_method || '',
      observation: document?.observation || '',
    },
  });

  // Update form when document changes
  useEffect(() => {
    if (document) {
      form.reset({
        code: document.code || '',
        creation_date:
          document.creation_date || format(new Date(), 'yyyy-MM-dd'),
        revision_date:
          document.revision_date || format(new Date(), 'yyyy-MM-dd'),
        document_name: document.document_name || '',
        document_type: document.document_type || undefined,
        document_path: document.document_path || '',
        document_state: document.document_state || 'REVISION',
        retention_period:
          document.retention_period || format(new Date(), 'yyyy-MM-dd'),
        disposal_method: document.disposal_method || '',
        observation: document.observation || '',
      });
      setFileUrl(document.document_path || '');
    } else {
      form.reset({
        code: '',
        creation_date: format(new Date(), 'yyyy-MM-dd'),
        revision_date: format(new Date(), 'yyyy-MM-dd'),
        document_name: '',
        document_type: undefined,
        document_path: '',
        document_state: 'REVISION',
        retention_period: format(new Date(), 'yyyy-MM-dd'),
        disposal_method: '',
        observation: '',
      });
      setFileUrl('');
      setSelectedFile(null);
    }
  }, [document, form]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      setSelectedFile(files[0]);
      setUploadProgress(0);
      form.setValue('document_path', files[0].name);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return '';

    try {
      setIsUploading(true);
      setUploadProgress(10);

      // Upload the file to S3
      const uploadedFileUrl = await uploadFileToS3(selectedFile);

      setUploadProgress(100);
      setFileUrl(uploadedFileUrl);

      toast({
        title: 'File uploaded',
        description: 'File has been successfully uploaded.',
      });

      return uploadedFileUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload Error',
        description: 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
      return '';
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      // If there's a new file selected, upload it first
      let documentPath = values.document_path || '';

      if (selectedFile) {
        documentPath = await handleFileUpload();
        if (!documentPath) {
          throw new Error('Failed to upload file');
        }
      }

      const documentData = {
        ...values,
        document_path: documentPath,
      };

      if (document) {
        // Update existing document
        const response = await fetch(`/api/documents/${document.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(documentData),
        });

        if (!response.ok) {
          throw new Error('Failed to update document');
        }
      } else {
        // Create new document
        const response = await fetch('/api/documents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(documentData),
        });

        if (!response.ok) {
          throw new Error('Failed to create document');
        }
      }

      toast({
        title: document ? 'Document updated' : 'Document created',
        description: document
          ? 'The document has been successfully updated.'
          : 'The document has been successfully created.',
      });

      form.reset();
      setSelectedFile(null);
      setFileUrl('');
      onSuccess();
      onClose();
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

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[600px]'>
          <div className='flex justify-center items-center p-8'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
            <span className='ml-2'>Loading...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const getFileNameFromUrl = (url: string) => {
    if (!url) return '';
    try {
      const urlParts = url.split('/');
      return urlParts[urlParts.length - 1];
    } catch (e) {
      return url;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>
            {document ? 'Edit Document' : 'Create Document'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter code' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='document_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter document name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='creation_date'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Creation Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={new Date(field.value)}
                          onSelect={(date) =>
                            field.onChange(format(date!, 'yyyy-MM-dd'))
                          }
                          disabled={(date) => date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='revision_date'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Revision Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={new Date(field.value)}
                          onSelect={(date) =>
                            field.onChange(format(date!, 'yyyy-MM-dd'))
                          }
                          disabled={(date) => date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='document_type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const selected = documentTypes.find(
                          (type) => type.id === value
                        );
                        field.onChange(selected);
                      }}
                      value={field.value?.id}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select document type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {documentTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id!}>
                            {type.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='document_state'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document State</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select state' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='REVISION'>Revision</SelectItem>
                        <SelectItem value='INUSE'>In Use</SelectItem>
                        <SelectItem value='OBSOLETE'>Obsolete</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='document_path'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document File</FormLabel>
                  <FormControl>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-4'>
                        <Input
                          type='file'
                          className='hidden'
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />
                        <Button
                          type='button'
                          variant='outline'
                          className='w-full'
                          onClick={handleFileClick}
                          disabled={isUploading}
                        >
                          <Upload className='h-4 w-4 mr-2' />
                          {selectedFile ? selectedFile.name : 'Choose file'}
                        </Button>
                      </div>

                      {isUploading && (
                        <div className='w-full bg-gray-200 rounded-full h-2.5'>
                          <div
                            className='bg-blue-600 h-2.5 rounded-full'
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}

                      {(fileUrl || field.value) && !selectedFile && (
                        <div className='flex items-center gap-2 text-sm text-gray-500'>
                          <FileIcon className='h-4 w-4' />
                          <a
                            href={fileUrl || field.value}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-500 hover:underline'
                          >
                            {getFileNameFromUrl(fileUrl || field.value || '')}
                          </a>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='retention_period'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Retention Period</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={new Date(field.value)}
                          onSelect={(date) =>
                            field.onChange(format(date!, 'yyyy-MM-dd'))
                          }
                          disabled={(date) => date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='disposal_method'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disposal Method</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter disposal method' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='observation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observation</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter observations'
                      className='min-h-[100px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-4 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={isSubmitting || isUploading}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting || isUploading}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    {document ? 'Updating...' : 'Creating...'}
                  </>
                ) : document ? (
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
  );
}
