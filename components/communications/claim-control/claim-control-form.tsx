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
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';

const formSchema = z.object({
  number: z.string().min(1, 'Number is required'),
  claim_complain_submitted_by: z
    .string()
    .min(2, 'Submitter name must be at least 2 characters'),
  claim_complain_reception_date: z.string(),
  claim_complain_description: z
    .string()
    .min(10, 'Description must be at least 10 characters'),
  treatment_action: z
    .string()
    .min(10, 'Treatment action must be at least 10 characters'),
  claim_complain_responsible_person: z
    .string()
    .min(2, 'Responsible person must be at least 2 characters'),
  claim_complain_deadline: z.string(),
  claim_complain_status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  closure_date: z.string(),
  observation: z.string().optional(),
});

interface ClaimControlFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  claim: ClaimComplainControl | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ClaimControlForm({
  open,
  onOpenChange,
  claim,
  onClose,
  onSuccess,
}: ClaimControlFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: claim?.number || '',
      claim_complain_submitted_by: claim?.claim_complain_submitted_by || '',
      claim_complain_reception_date:
        claim?.claim_complain_reception_date ||
        format(new Date(), 'yyyy-MM-dd'),
      claim_complain_description: claim?.claim_complain_description || '',
      treatment_action: claim?.treatment_action || '',
      claim_complain_responsible_person:
        claim?.claim_complain_responsible_person || '',
      claim_complain_deadline:
        claim?.claim_complain_deadline || format(new Date(), 'yyyy-MM-dd'),
      claim_complain_status: claim?.claim_complain_status || 'PENDING',
      closure_date: claim?.closure_date || format(new Date(), 'yyyy-MM-dd'),
      observation: claim?.observation || '',
    },
  });

  // Update form when claim changes
  useEffect(() => {
    if (claim) {
      form.reset({
        number: claim.number,
        claim_complain_submitted_by: claim.claim_complain_submitted_by,
        claim_complain_reception_date: claim.claim_complain_reception_date,
        claim_complain_description: claim.claim_complain_description,
        treatment_action: claim.treatment_action,
        claim_complain_responsible_person:
          claim.claim_complain_responsible_person,
        claim_complain_deadline: claim.claim_complain_deadline,
        claim_complain_status: claim.claim_complain_status,
        closure_date: claim.closure_date,
        observation: claim.observation,
      });
    } else {
      form.reset({
        number: '',
        claim_complain_submitted_by: '',
        claim_complain_reception_date: format(new Date(), 'yyyy-MM-dd'),
        claim_complain_description: '',
        treatment_action: '',
        claim_complain_responsible_person: '',
        claim_complain_deadline: format(new Date(), 'yyyy-MM-dd'),
        claim_complain_status: 'PENDING',
        closure_date: format(new Date(), 'yyyy-MM-dd'),
        observation: '',
      });
    }
  }, [claim, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (claim) {
        // Update existing claim complain control record
        const response = await fetch(`/api/claim-complain/${claim.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Failed to update claim complain control record'
          );
        }

        toast({
          title: 'Record updated',
          description:
            'The claim complain control record has been successfully updated.',
        });
      } else {
        // Create new claim complain control record
        const response = await fetch('/api/claim-complain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Failed to create claim complain control record'
          );
        }

        toast({
          title: 'Record created',
          description:
            'The claim complain control record has been successfully created.',
        });
      }

      form.reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving claim complain control record:', error);
      toast({
        title: 'Error',
        description:
          error.message ||
          'There was an error saving the claim complain control record. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[800px] h-[90vh] flex flex-col p-0'>
        <DialogHeader className='px-6 py-4 border-b'>
          <DialogTitle>
            {claim ? 'Edit Claim/Complaint' : 'Create Claim/Complaint'}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className='flex-1 p-6'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='number'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter number' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='claim_complain_submitted_by'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Submitted By</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter submitter name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='claim_complain_responsible_person'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsible Person</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter responsible person'
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
                  name='claim_complain_reception_date'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Reception Date</FormLabel>
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
                  name='claim_complain_deadline'
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

                <FormField
                  control={form.control}
                  name='closure_date'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Closure Date</FormLabel>
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
                name='claim_complain_description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter claim/complaint description'
                        className='min-h-[100px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='treatment_action'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treatment Action</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter treatment action'
                        className='min-h-[100px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='claim_complain_status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select status' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='PENDING'>Pending</SelectItem>
                          <SelectItem value='IN_PROGRESS'>
                            In Progress
                          </SelectItem>
                          <SelectItem value='COMPLETED'>Completed</SelectItem>
                        </SelectContent>
                      </Select>
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
            </form>
          </Form>
        </ScrollArea>
        <div className='flex justify-end gap-4 p-6 border-t'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                {claim ? 'Updating...' : 'Creating...'}
              </>
            ) : claim ? (
              'Update'
            ) : (
              'Create'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
