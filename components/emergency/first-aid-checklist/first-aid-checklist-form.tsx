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
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const formSchema = z.object({
  descricao: z.string().min(2, 'Description must be at least 2 characters'),
  quantidade: z.number().min(0, 'Quantity must be 0 or greater'),
  data: z.string(),
  prazo: z.string(),
  observacao: z.string(),
  inspecao_realizada_por: z
    .string()
    .min(2, 'Inspector name must be at least 2 characters'),
});

interface FirstAidKitChecklistFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checklist: FirstAidKitChecklist | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function FirstAidKitChecklistForm({
  open,
  onOpenChange,
  checklist,
  onClose,
  onSuccess,
}: FirstAidKitChecklistFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descricao: checklist?.descricao || '',
      quantidade: checklist?.quantidade || 0,
      data: checklist?.data || format(new Date(), 'yyyy-MM-dd'),
      prazo: checklist?.prazo || format(new Date(), 'yyyy-MM-dd'),
      observacao: checklist?.observacao || '',
      inspecao_realizada_por: checklist?.inspecao_realizada_por || '',
    },
  });

  // Update form when checklist changes
  useEffect(() => {
    if (checklist) {
      form.reset({
        descricao: checklist.descricao,
        quantidade: checklist.quantidade,
        data: checklist.data,
        prazo: checklist.prazo,
        observacao: checklist.observacao,
        inspecao_realizada_por: checklist.inspecao_realizada_por,
      });
    } else {
      form.reset({
        descricao: '',
        quantidade: 0,
        data: format(new Date(), 'yyyy-MM-dd'),
        prazo: format(new Date(), 'yyyy-MM-dd'),
        observacao: '',
        inspecao_realizada_por: '',
      });
    }
  }, [checklist, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (checklist) {
        // Update existing checklist item
        const response = await fetch(
          `/api/first-aid-checklist/${checklist.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update first aid kit checklist item');
        }

        toast({
          title: 'Checklist item updated',
          description:
            'The first aid kit checklist item has been successfully updated.',
        });
      } else {
        // Create new checklist item
        const response = await fetch('/api/first-aid-checklist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to create first aid kit checklist item');
        }

        toast({
          title: 'Checklist item created',
          description:
            'The first aid kit checklist item has been successfully created.',
        });
      }

      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving first aid kit checklist item:', error);
      toast({
        title: 'Error',
        description:
          'There was an error saving the first aid kit checklist item. Please try again.',
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
            {checklist
              ? 'Edit First Aid Kit Checklist Item'
              : 'Create First Aid Kit Checklist Item'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='descricao'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter item description' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='quantidade'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Enter quantity'
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='data'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Date</FormLabel>
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
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
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
                name='prazo'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Deadline</FormLabel>
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

            <FormField
              control={form.control}
              name='observacao'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observations</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter observations'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='inspecao_realizada_por'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inspected By</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter inspector name' {...field} />
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
                    {checklist ? 'Updating...' : 'Creating...'}
                  </>
                ) : checklist ? (
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
