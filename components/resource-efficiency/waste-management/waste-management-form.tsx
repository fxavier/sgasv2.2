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
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  waste_route: z.string().min(2, 'Waste route must be at least 2 characters'),
  labelling: z.string().min(2, 'Labelling must be at least 2 characters'),
  storage: z.string().min(2, 'Storage must be at least 2 characters'),
  transportation_company_method: z
    .string()
    .min(2, 'Transportation method must be at least 2 characters'),
  disposal_company: z
    .string()
    .min(2, 'Disposal company must be at least 2 characters'),
  special_instructions: z.string().optional(),
});

interface WasteManagementFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  waste: WasteManagement | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function WasteManagementForm({
  open,
  onOpenChange,
  waste,
  onClose,
  onSuccess,
}: WasteManagementFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      waste_route: waste?.waste_route || '',
      labelling: waste?.labelling || '',
      storage: waste?.storage || '',
      transportation_company_method: waste?.transportation_company_method || '',
      disposal_company: waste?.disposal_company || '',
      special_instructions: waste?.special_instructions || '',
    },
  });

  // Update form when waste changes
  useEffect(() => {
    if (waste) {
      form.reset({
        waste_route: waste.waste_route,
        labelling: waste.labelling,
        storage: waste.storage,
        transportation_company_method: waste.transportation_company_method,
        disposal_company: waste.disposal_company,
        special_instructions: waste.special_instructions,
      });
    } else {
      form.reset({
        waste_route: '',
        labelling: '',
        storage: '',
        transportation_company_method: '',
        disposal_company: '',
        special_instructions: '',
      });
    }
  }, [waste, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (waste) {
        // Update existing waste management record
        const response = await fetch(`/api/waste-management/${waste.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Failed to update waste management record'
          );
        }

        toast({
          title: 'Record updated',
          description:
            'The waste management record has been successfully updated.',
        });
      } else {
        // Create new waste management record
        const response = await fetch('/api/waste-management', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Failed to create waste management record'
          );
        }

        toast({
          title: 'Record created',
          description:
            'The waste management record has been successfully created.',
        });
      }

      form.reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving waste management record:', error);
      toast({
        title: 'Error',
        description:
          error.message ||
          'There was an error saving the waste management record. Please try again.',
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
            {waste ? 'Edit Waste Management' : 'Create Waste Management'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='waste_route'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Waste Route</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter waste route' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='labelling'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Labelling</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter labelling' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='storage'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Storage</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter storage details' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='transportation_company_method'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transportation Company & Method</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter transportation details'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='disposal_company'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disposal Company</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter disposal company' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='special_instructions'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter special instructions'
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
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    {waste ? 'Updating...' : 'Creating...'}
                  </>
                ) : waste ? (
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
