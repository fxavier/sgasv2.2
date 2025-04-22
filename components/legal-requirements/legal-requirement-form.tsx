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
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { uploadFileToS3 } from '@/lib/upload-service';

const formSchema = z.object({
  number: z.string().min(1, 'Number is required'),
  document_title: z.string().min(2, 'Title must be at least 2 characters'),
  effective_date: z.string().min(1, 'Effective date is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  status: z.enum(['active', 'inactive', 'pending', 'expired']),
  amended_description: z.string().optional(),
  observation: z.string().optional(),
  law_file: z.instanceof(File).optional(),
});

interface LegalRequirementFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requirement: LegalRequirement | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LegalRequirementForm({
  open,
  onOpenChange,
  requirement,
  onClose,
  onSuccess,
}: LegalRequirementFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: requirement?.number || '',
      document_title: requirement?.document_title || '',
      effective_date: requirement?.effective_date || '',
      description: requirement?.description || '',
      status: requirement?.status || 'active',
      amended_description: requirement?.amended_description || '',
      observation: requirement?.observation || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      let lawFileUrl = requirement?.law_file;

      // Handle file upload if a new file is provided
      if (values.law_file) {
        setIsUploading(true);
        try {
          lawFileUrl = await uploadFileToS3(values.law_file);
        } catch (error) {
          console.error('Error uploading file:', error);
          toast({
            title: 'Error',
            description: 'Failed to upload law file. Please try again.',
            variant: 'destructive',
          });
          return;
        } finally {
          setIsUploading(false);
        }
      }

      // Map form values to API expected format
      const apiData = {
        number: values.number,
        documentTitle: values.document_title,
        effectiveDate: values.effective_date,
        description: values.description,
        status: values.status.toUpperCase(),
        amendedDescription: values.amended_description,
        observation: values.observation,
        lawFile: lawFileUrl,
      };

      if (requirement) {
        // Update existing requirement
        const response = await fetch(
          `/api/risks/legal-requirements/${requirement.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiData),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update legal requirement');
        }
      } else {
        // Create new requirement
        const response = await fetch('/api/risks/legal-requirements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiData),
        });

        if (!response.ok) {
          throw new Error('Failed to create legal requirement');
        }
      }

      toast({
        title: requirement ? 'Requirement updated' : 'Requirement created',
        description: requirement
          ? 'The legal requirement has been successfully updated.'
          : 'The legal requirement has been successfully created.',
      });

      form.reset();
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving legal requirement:', error);
      toast({
        title: 'Error',
        description:
          'There was an error saving the legal requirement. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>
            {requirement
              ? 'Edit Legal Requirement'
              : 'Create Legal Requirement'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                control={form.control}
                name='number'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number</FormLabel>
                    <FormControl>
                      <Input placeholder='FR.AS.003' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='effective_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Effective Date</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='active'>Active</SelectItem>
                        <SelectItem value='inactive'>Inactive</SelectItem>
                        <SelectItem value='pending'>Pending</SelectItem>
                        <SelectItem value='expired'>Expired</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                control={form.control}
                name='document_title'
                render={({ field }) => (
                  <FormItem className='md:col-span-3'>
                    <FormLabel>Document Title</FormLabel>
                    <FormControl>
                      <Input placeholder='Document title' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem className='md:col-span-3'>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Requirement description'
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                control={form.control}
                name='amended_description'
                render={({ field }) => (
                  <FormItem className='md:col-span-3'>
                    <FormLabel>Amended Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Amended description (optional)'
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                control={form.control}
                name='observation'
                render={({ field }) => (
                  <FormItem className='md:col-span-3'>
                    <FormLabel>Observation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Additional observations (optional)'
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                control={form.control}
                name='law_file'
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem className='md:col-span-3'>
                    <FormLabel>Law File</FormLabel>
                    <FormControl>
                      <Input
                        type='file'
                        accept='.pdf,.doc,.docx'
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                        {...field}
                      />
                    </FormControl>
                    {requirement?.law_file && (
                      <div className='mt-2 text-sm text-gray-500'>
                        Current file: {requirement.law_file.split('/').pop()}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex justify-end gap-4 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    {requirement ? 'Updating...' : 'Creating...'}
                  </>
                ) : requirement ? (
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
