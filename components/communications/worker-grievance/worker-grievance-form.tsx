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
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().min(2, 'Company must be at least 2 characters'),
  date: z.string(),
  prefered_contact_method: z.enum(['EMAIL', 'PHONE', 'FACE_TO_FACE']),
  contact: z
    .string()
    .min(2, 'Contact information must be at least 2 characters'),
  prefered_language: z.enum(['PORTUGUESE', 'ENGLISH', 'OTHER']),
  other_language: z.string().optional(),
  grievance_details: z
    .string()
    .min(10, 'Grievance details must be at least 10 characters'),
  unique_identification_of_company_acknowlegement: z
    .string()
    .min(2, 'Identification must be at least 2 characters'),
  name_of_person_acknowledging_grievance: z
    .string()
    .min(2, 'Name must be at least 2 characters'),
  position_of_person_acknowledging_grievance: z
    .string()
    .min(2, 'Position must be at least 2 characters'),
  date_of_acknowledgement: z.string(),
  signature_of_person_acknowledging_grievance: z
    .string()
    .min(2, 'Signature must be at least 2 characters'),
  follow_up_details: z.string().optional(),
  closed_out_date: z.string(),
  signature_of_response_corrective_action_person: z
    .string()
    .min(2, 'Signature must be at least 2 characters'),
  acknowledge_receipt_of_response: z
    .string()
    .min(2, 'Acknowledgement must be at least 2 characters'),
  name_of_person_acknowledging_response: z
    .string()
    .min(2, 'Name must be at least 2 characters'),
  signature_of_person_acknowledging_response: z
    .string()
    .min(2, 'Signature must be at least 2 characters'),
  date_of_acknowledgement_response: z.string(),
});

interface WorkerGrievanceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grievance: WorkerGrievance | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function WorkerGrievanceForm({
  open,
  onOpenChange,
  grievance,
  onClose,
  onSuccess,
}: WorkerGrievanceFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: grievance?.name || '',
      company: grievance?.company || '',
      date: grievance?.date || format(new Date(), 'yyyy-MM-dd'),
      prefered_contact_method: grievance?.prefered_contact_method || 'EMAIL',
      contact: grievance?.contact || '',
      prefered_language: grievance?.prefered_language || 'ENGLISH',
      other_language: grievance?.other_language || '',
      grievance_details: grievance?.grievance_details || '',
      unique_identification_of_company_acknowlegement:
        grievance?.unique_identification_of_company_acknowlegement || '',
      name_of_person_acknowledging_grievance:
        grievance?.name_of_person_acknowledging_grievance || '',
      position_of_person_acknowledging_grievance:
        grievance?.position_of_person_acknowledging_grievance || '',
      date_of_acknowledgement:
        grievance?.date_of_acknowledgement || format(new Date(), 'yyyy-MM-dd'),
      signature_of_person_acknowledging_grievance:
        grievance?.signature_of_person_acknowledging_grievance || '',
      follow_up_details: grievance?.follow_up_details || '',
      closed_out_date:
        grievance?.closed_out_date || format(new Date(), 'yyyy-MM-dd'),
      signature_of_response_corrective_action_person:
        grievance?.signature_of_response_corrective_action_person || '',
      acknowledge_receipt_of_response:
        grievance?.acknowledge_receipt_of_response || '',
      name_of_person_acknowledging_response:
        grievance?.name_of_person_acknowledging_response || '',
      signature_of_person_acknowledging_response:
        grievance?.signature_of_person_acknowledging_response || '',
      date_of_acknowledgement_response:
        grievance?.date_of_acknowledgement_response ||
        format(new Date(), 'yyyy-MM-dd'),
    },
  });

  // Update form when grievance changes
  useEffect(() => {
    if (grievance) {
      form.reset({
        name: grievance.name,
        company: grievance.company,
        date: grievance.date,
        prefered_contact_method: grievance.prefered_contact_method,
        contact: grievance.contact,
        prefered_language: grievance.prefered_language,
        other_language: grievance.other_language,
        grievance_details: grievance.grievance_details,
        unique_identification_of_company_acknowlegement:
          grievance.unique_identification_of_company_acknowlegement,
        name_of_person_acknowledging_grievance:
          grievance.name_of_person_acknowledging_grievance,
        position_of_person_acknowledging_grievance:
          grievance.position_of_person_acknowledging_grievance,
        date_of_acknowledgement: grievance.date_of_acknowledgement,
        signature_of_person_acknowledging_grievance:
          grievance.signature_of_person_acknowledging_grievance,
        follow_up_details: grievance.follow_up_details,
        closed_out_date: grievance.closed_out_date,
        signature_of_response_corrective_action_person:
          grievance.signature_of_response_corrective_action_person,
        acknowledge_receipt_of_response:
          grievance.acknowledge_receipt_of_response,
        name_of_person_acknowledging_response:
          grievance.name_of_person_acknowledging_response,
        signature_of_person_acknowledging_response:
          grievance.signature_of_person_acknowledging_response,
        date_of_acknowledgement_response:
          grievance.date_of_acknowledgement_response,
      });
    } else {
      form.reset({
        name: '',
        company: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        prefered_contact_method: 'EMAIL',
        contact: '',
        prefered_language: 'ENGLISH',
        other_language: '',
        grievance_details: '',
        unique_identification_of_company_acknowlegement: '',
        name_of_person_acknowledging_grievance: '',
        position_of_person_acknowledging_grievance: '',
        date_of_acknowledgement: format(new Date(), 'yyyy-MM-dd'),
        signature_of_person_acknowledging_grievance: '',
        follow_up_details: '',
        closed_out_date: format(new Date(), 'yyyy-MM-dd'),
        signature_of_response_corrective_action_person: '',
        acknowledge_receipt_of_response: '',
        name_of_person_acknowledging_response: '',
        signature_of_person_acknowledging_response: '',
        date_of_acknowledgement_response: format(new Date(), 'yyyy-MM-dd'),
      });
    }
  }, [grievance, form]);

  const preferedLanguage = form.watch('prefered_language');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (grievance) {
        // Update existing worker grievance
        const response = await fetch(`/api/worker-grievance/${grievance.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Failed to update worker grievance'
          );
        }

        toast({
          title: 'Grievance updated',
          description: 'The worker grievance has been successfully updated.',
        });
      } else {
        // Create new worker grievance
        const response = await fetch('/api/worker-grievance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Failed to create worker grievance'
          );
        }

        toast({
          title: 'Grievance created',
          description: 'The worker grievance has been successfully created.',
        });
      }

      form.reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving worker grievance:', error);
      toast({
        title: 'Error',
        description:
          error.message ||
          'There was an error saving the worker grievance. Please try again.',
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
            {grievance ? 'Edit Worker Grievance' : 'Create Worker Grievance'}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className='flex-1 p-6'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='company'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter company name' {...field} />
                      </FormControl>
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
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='prefered_contact_method'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Contact Method</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select contact method' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='EMAIL'>Email</SelectItem>
                          <SelectItem value='PHONE'>Phone</SelectItem>
                          <SelectItem value='FACE_TO_FACE'>
                            Face to Face
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='contact'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter contact information'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='prefered_language'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Language</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select language' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='PORTUGUESE'>Portuguese</SelectItem>
                          <SelectItem value='ENGLISH'>English</SelectItem>
                          <SelectItem value='OTHER'>Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {preferedLanguage === 'OTHER' && (
                <FormField
                  control={form.control}
                  name='other_language'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Language</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Specify other language'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name='grievance_details'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grievance Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter grievance details'
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
                  name='unique_identification_of_company_acknowlegement'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Acknowledgement ID</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter identification' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='name_of_person_acknowledging_grievance'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Acknowledging Person Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='position_of_person_acknowledging_grievance'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Acknowledging Person Position</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter position' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='date_of_acknowledgement'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Acknowledgement Date</FormLabel>
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
                  name='signature_of_person_acknowledging_grievance'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Acknowledging Person Signature</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter signature' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='follow_up_details'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Follow-up Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter follow-up details'
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
                  name='closed_out_date'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Close-out Date</FormLabel>
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
                  name='signature_of_response_corrective_action_person'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corrective Action Person Signature</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter signature' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='acknowledge_receipt_of_response'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Response Receipt Acknowledgement</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter acknowledgement' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='name_of_person_acknowledging_response'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Response Acknowledging Person Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='signature_of_person_acknowledging_response'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Response Acknowledging Person Signature
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Enter signature' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='date_of_acknowledgement_response'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Response Acknowledgement Date</FormLabel>
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
                {grievance ? 'Updating...' : 'Creating...'}
              </>
            ) : grievance ? (
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
