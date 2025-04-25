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
import { useState } from 'react';

// Define the WasteTransferLog interface
export interface WasteTransferLog {
  id: string;
  wasteType: string;
  howIsWasteContained: string;
  howMuchWaste: number;
  referenceNumber: string;
  dateOfRemoval: string;
  transferCompany: string;
  specialInstructions: string;
  createdAt?: string;
  updatedAt?: string;
}

const formSchema = z.object({
  wasteType: z.string().min(2, 'Waste type must be at least 2 characters'),
  howIsWasteContained: z
    .string()
    .min(2, 'Containment method must be at least 2 characters'),
  howMuchWaste: z.number().min(0, 'Waste amount must be 0 or greater'),
  referenceNumber: z
    .string()
    .min(2, 'Reference number must be at least 2 characters'),
  dateOfRemoval: z.string(),
  transferCompany: z
    .string()
    .min(2, 'Transfer company must be at least 2 characters'),
  specialInstructions: z.string(),
});

interface WasteTransferLogFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: WasteTransferLog | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function WasteTransferLogForm({
  open,
  onOpenChange,
  log,
  onClose,
  onSuccess,
}: WasteTransferLogFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wasteType: log?.wasteType || '',
      howIsWasteContained: log?.howIsWasteContained || '',
      howMuchWaste: log?.howMuchWaste || 0,
      referenceNumber: log?.referenceNumber || '',
      dateOfRemoval: log?.dateOfRemoval || format(new Date(), 'yyyy-MM-dd'),
      transferCompany: log?.transferCompany || '',
      specialInstructions: log?.specialInstructions || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (log) {
        // Update existing log
        const response = await fetch(`/api/waste-transfer-log`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: log.id,
            ...values,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || 'Failed to update waste transfer log'
          );
        }

        toast({
          title: 'Log updated',
          description: 'The waste transfer log has been successfully updated.',
        });
      } else {
        // Create new log
        const response = await fetch('/api/waste-transfer-log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || 'Failed to create waste transfer log'
          );
        }

        toast({
          title: 'Log created',
          description: 'The waste transfer log has been successfully created.',
        });
      }

      form.reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving waste transfer log:', error);
      toast({
        title: 'Error',
        description:
          error.message ||
          'There was an error saving the waste transfer log. Please try again.',
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
            {log ? 'Edit Waste Transfer Log' : 'Create Waste Transfer Log'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='wasteType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waste Type</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter waste type' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='howIsWasteContained'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Containment Method</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter containment method'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='howMuchWaste'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waste Amount</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Enter waste amount'
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='referenceNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Number</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter reference number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='dateOfRemoval'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Date of Removal</FormLabel>
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
                name='transferCompany'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transfer Company</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter transfer company' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='specialInstructions'
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
                    {log ? 'Updating...' : 'Creating...'}
                  </>
                ) : log ? (
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
