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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const formSchema = z.object({
  description: z.string().min(2, 'Description must be at least 2 characters'),
});

interface DocumentTypeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: DocumentType | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function DocumentTypeForm({
  open,
  onOpenChange,
  type,
  onClose,
  onSuccess,
}: DocumentTypeFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: type?.description || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (type) {
        // Update existing document type
        const response = await fetch(`/api/document-types/${type.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to update document type');
        }
      } else {
        // Create new document type
        const response = await fetch('/api/document-types', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to create document type');
        }
      }

      toast({
        title: type ? 'Document type updated' : 'Document type created',
        description: type
          ? 'The document type has been successfully updated.'
          : 'The document type has been successfully created.',
      });

      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving document type:', error);
      toast({
        title: 'Error',
        description:
          'There was an error saving the document type. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {type ? 'Edit Document Type' : 'Create Document Type'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter description' {...field} />
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
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : type ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
