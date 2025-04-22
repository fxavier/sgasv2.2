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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, Plus } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { AcceptanceConfirmationForm } from '@/components/training/acceptance-confirmation-form';

const formSchema = z.object({
  fullname: z.string().min(2, 'Full name must be at least 2 characters'),
  designation: z.string().optional(),
  terms_of_office_from: z.string().optional(),
  terms_of_office_to: z.string().optional(),
  acceptance_confirmation: z.array(
    z.object({
      id: z.string(),
      description: z.string(),
    })
  ),
  date: z.string(),
});

interface OHSActingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: OHSActing | null;
  onClose: () => void;
}

export function OHSActingForm({
  open,
  onOpenChange,
  entry,
  onClose,
}: OHSActingFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptanceConfirmations, setAcceptanceConfirmations] = useState<
    AcceptanceConfirmation[]
  >([]);
  const [isAddConfirmationOpen, setIsAddConfirmationOpen] = useState(false);

  // Fetch acceptance confirmations
  useEffect(() => {
    if (open) {
      const fetchConfirmations = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('/api/acceptance-confirmations');
          if (!response.ok) {
            throw new Error('Failed to fetch acceptance confirmations');
          }
          const data = await response.json();
          setAcceptanceConfirmations(data);
        } catch (error) {
          console.error('Error fetching acceptance confirmations:', error);
          toast({
            title: 'Error',
            description:
              'Failed to load acceptance confirmations. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchConfirmations();
    }
  }, [open, toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: entry?.fullname || '',
      designation: entry?.designation || '',
      terms_of_office_from: entry?.terms_of_office_from || '',
      terms_of_office_to: entry?.terms_of_office_to || '',
      acceptance_confirmation: entry?.acceptance_confirmation || [],
      date: entry?.date || format(new Date(), 'yyyy-MM-dd'),
    },
  });

  // Update form when entry changes
  useEffect(() => {
    if (entry) {
      form.reset({
        fullname: entry.fullname,
        designation: entry.designation,
        terms_of_office_from: entry.terms_of_office_from,
        terms_of_office_to: entry.terms_of_office_to,
        acceptance_confirmation: entry.acceptance_confirmation,
        date: entry.date,
      });
    } else {
      form.reset({
        fullname: '',
        designation: '',
        terms_of_office_from: '',
        terms_of_office_to: '',
        acceptance_confirmation: [],
        date: format(new Date(), 'yyyy-MM-dd'),
      });
    }
  }, [entry, form]);

  const handleConfirmationSuccess = async () => {
    try {
      // Fetch updated acceptance confirmations
      const response = await fetch('/api/acceptance-confirmations');
      if (response.ok) {
        const data = await response.json();
        setAcceptanceConfirmations(data);
      }
    } catch (error) {
      console.error('Error fetching acceptance confirmations:', error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (entry) {
        // Update existing entry
        const response = await fetch(`/api/ohs-acting/${entry.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to update OHS acting entry');
        }

        toast({
          title: 'Entry updated',
          description: 'The OHS acting entry has been successfully updated.',
        });
      } else {
        // Create new entry
        const response = await fetch('/api/ohs-acting', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to create OHS acting entry');
        }

        toast({
          title: 'Entry created',
          description: 'The OHS acting entry has been successfully created.',
        });
      }

      form.reset();
      onClose();
    } catch (error) {
      console.error('Error saving OHS acting entry:', error);
      toast({
        title: 'Error',
        description:
          'There was an error saving the OHS acting entry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[600px]'>
          <div className='flex justify-center items-center p-8'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
            <span className='ml-2'>Loading form data...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>
              {entry ? 'Edit OHS Acting Entry' : 'Create OHS Acting Entry'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='fullname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter full name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='designation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter designation' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='terms_of_office_from'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms of Office From</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter start date' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='terms_of_office_to'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms of Office To</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter end date' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='acceptance_confirmation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Acceptance Confirmation</FormLabel>
                    <div className='flex gap-2'>
                      <Select
                        onValueChange={(value) => {
                          const selected = acceptanceConfirmations.find(
                            (conf) => conf.id === value
                          );
                          if (selected) {
                            // Check if already selected
                            const isAlreadySelected = field.value.some(
                              (item) => item.id === selected.id
                            );

                            if (!isAlreadySelected) {
                              field.onChange([...field.value, selected]);
                            }
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select confirmation' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {acceptanceConfirmations.map((conf) => (
                            <SelectItem key={conf.id} value={conf.id}>
                              {conf.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() => setIsAddConfirmationOpen(true)}
                      >
                        <Plus className='h-4 w-4' />
                      </Button>
                    </div>

                    {/* Display selected confirmations */}
                    {field.value.length > 0 && (
                      <div className='mt-2 space-y-2'>
                        <p className='text-sm font-medium'>
                          Selected confirmations:
                        </p>
                        <ul className='text-sm space-y-1'>
                          {field.value.map((conf) => (
                            <li
                              key={conf.id}
                              className='flex justify-between items-center p-2 bg-gray-50 rounded'
                            >
                              <span>{conf.description}</span>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => {
                                  field.onChange(
                                    field.value.filter(
                                      (item) => item.id !== conf.id
                                    )
                                  );
                                }}
                              >
                                Remove
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='date'
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
                          disabled={(date) => date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                      {entry ? 'Updating...' : 'Creating...'}
                    </>
                  ) : entry ? (
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

      {/* Acceptance Confirmation Form */}
      <AcceptanceConfirmationForm
        open={isAddConfirmationOpen}
        onOpenChange={setIsAddConfirmationOpen}
        onClose={() => setIsAddConfirmationOpen(false)}
        onSuccess={handleConfirmationSuccess}
      />
    </>
  );
}
