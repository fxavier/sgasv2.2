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
import { Calendar as CalendarIcon, Loader2, Plus } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Form for adding new incident type
const incidentFormSchema = z.object({
  description: z.string().min(2, 'Description must be at least 2 characters'),
});

function IncidentDialog({
  open,
  onOpenChange,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onSuccess: (incident: { id: string; description: string }) => void;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof incidentFormSchema>>({
    resolver: zodResolver(incidentFormSchema),
    defaultValues: {
      description: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof incidentFormSchema>) => {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to create incident');
      }

      const incident = await response.json();

      toast({
        title: 'Incident created',
        description: 'The incident has been successfully created.',
      });

      form.reset();
      onSuccess(incident);
      onClose();
    } catch (error) {
      console.error('Error creating incident:', error);
      toast({
        title: 'Error',
        description:
          'There was an error creating the incident. Please try again.',
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
          <DialogTitle>Create Incident Type</DialogTitle>
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
                    <Input
                      placeholder='Enter incident description'
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
                    Creating...
                  </>
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

const formSchema = z.object({
  incidents: z.array(
    z.object({
      id: z.string(),
      description: z.string(),
    })
  ),
  date_incident: z.string(),
  time_incident: z.string(),
  section: z.string().optional(),
  location_incident: z
    .string()
    .min(2, 'Location must be at least 2 characters'),
  date_reported: z.string(),
  supervisor: z
    .string()
    .min(2, 'Supervisor name must be at least 2 characters'),
  type: z.enum(['Employee', 'Subcontrator']),
  employee_name: z.string().optional(),
  subcontrator_name: z.string().optional(),
  incident_description: z
    .string()
    .min(10, 'Description must be at least 10 characters'),
  details_of_injured_person: z
    .string()
    .min(10, 'Details must be at least 10 characters'),
  witness_statement: z.string().optional(),
  preliminary_findings: z.string().optional(),
  recomendations: z
    .string()
    .min(10, 'Recommendations must be at least 10 characters'),
  further_investigation_required: z.enum(['Yes', 'No']),
  incident_reportable: z.enum(['Yes', 'No']),
  lenders_to_be_notified: z.enum(['Yes', 'No']),
  author_of_report: z
    .string()
    .min(2, 'Author name must be at least 2 characters'),
  approver_name: z
    .string()
    .min(2, 'Approver name must be at least 2 characters'),
  date_approved: z.string(),
});

interface IncidentFlashReportFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: IncidentFlashReport | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function IncidentFlashReportForm({
  open,
  onOpenChange,
  report,
  onClose,
  onSuccess,
}: IncidentFlashReportFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isAddIncidentOpen, setIsAddIncidentOpen] = useState(false);

  // Fetch incidents
  useEffect(() => {
    if (open) {
      const fetchIncidents = async () => {
        try {
          setIsLoading(true);
          const response = await fetch('/api/incidents');
          if (!response.ok) {
            throw new Error('Failed to fetch incidents');
          }
          const data = await response.json();
          setIncidents(data);
        } catch (error) {
          console.error('Error fetching incidents:', error);
          toast({
            title: 'Error',
            description: 'Failed to load incidents. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchIncidents();
    }
  }, [open, toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      incidents: report?.incidents || [],
      date_incident: report?.date_incident || format(new Date(), 'yyyy-MM-dd'),
      time_incident: report?.time_incident || format(new Date(), 'HH:mm'),
      section: report?.section || '',
      location_incident: report?.location_incident || '',
      date_reported: report?.date_reported || format(new Date(), 'yyyy-MM-dd'),
      supervisor: report?.supervisor || '',
      type: report?.type || 'Employee',
      employee_name: report?.employee_name || '',
      subcontrator_name: report?.subcontrator_name || '',
      incident_description: report?.incident_description || '',
      details_of_injured_person: report?.details_of_injured_person || '',
      witness_statement: report?.witness_statement || '',
      preliminary_findings: report?.preliminary_findings || '',
      recomendations: report?.recomendations || '',
      further_investigation_required:
        report?.further_investigation_required || 'No',
      incident_reportable: report?.incident_reportable || 'No',
      lenders_to_be_notified: report?.lenders_to_be_notified || 'No',
      author_of_report: report?.author_of_report || '',
      approver_name: report?.approver_name || '',
      date_approved: report?.date_approved || format(new Date(), 'yyyy-MM-dd'),
    },
  });

  // Update form when report changes
  useEffect(() => {
    if (report) {
      form.reset({
        incidents: report.incidents,
        date_incident: report.date_incident,
        time_incident: report.time_incident,
        section: report.section,
        location_incident: report.location_incident,
        date_reported: report.date_reported,
        supervisor: report.supervisor,
        type: report.type,
        employee_name: report.employee_name,
        subcontrator_name: report.subcontrator_name,
        incident_description: report.incident_description,
        details_of_injured_person: report.details_of_injured_person,
        witness_statement: report.witness_statement,
        preliminary_findings: report.preliminary_findings,
        recomendations: report.recomendations,
        further_investigation_required: report.further_investigation_required,
        incident_reportable: report.incident_reportable,
        lenders_to_be_notified: report.lenders_to_be_notified,
        author_of_report: report.author_of_report,
        approver_name: report.approver_name,
        date_approved: report.date_approved,
      });
    } else {
      form.reset({
        incidents: [],
        date_incident: format(new Date(), 'yyyy-MM-dd'),
        time_incident: format(new Date(), 'HH:mm'),
        section: '',
        location_incident: '',
        date_reported: format(new Date(), 'yyyy-MM-dd'),
        supervisor: '',
        type: 'Employee',
        employee_name: '',
        subcontrator_name: '',
        incident_description: '',
        details_of_injured_person: '',
        witness_statement: '',
        preliminary_findings: '',
        recomendations: '',
        further_investigation_required: 'No',
        incident_reportable: 'No',
        lenders_to_be_notified: 'No',
        author_of_report: '',
        approver_name: '',
        date_approved: format(new Date(), 'yyyy-MM-dd'),
      });
    }
  }, [report, form]);

  const type = form.watch('type');

  const handleIncidentSuccess = (incident: {
    id: string;
    description: string;
  }) => {
    // Add the new incident to the form
    const currentIncidents = form.getValues('incidents') || [];
    form.setValue('incidents', [...currentIncidents, incident]);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (report) {
        // Update existing report
        const response = await fetch(
          `/api/incident-flash-reports/${report.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update incident flash report');
        }

        toast({
          title: 'Report updated',
          description:
            'The incident flash report has been successfully updated.',
        });
      } else {
        // Create new report
        const response = await fetch('/api/incident-flash-reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to create incident flash report');
        }

        toast({
          title: 'Report created',
          description:
            'The incident flash report has been successfully created.',
        });
      }

      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving incident flash report:', error);
      toast({
        title: 'Error',
        description:
          'There was an error saving the incident flash report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[800px]'>
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
        <DialogContent className='sm:max-w-[800px] h-[90vh] flex flex-col p-0'>
          <DialogHeader className='px-6 py-4 border-b'>
            <DialogTitle>
              {report
                ? 'Edit Incident Flash Report'
                : 'Create Incident Flash Report'}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className='flex-1 p-6'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <FormField
                  control={form.control}
                  name='incidents'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incident Type</FormLabel>
                      <div className='flex gap-2'>
                        <Select
                          onValueChange={(value) => {
                            const selected = incidents.find(
                              (incident) => incident.id === value
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
                              <SelectValue placeholder='Select incident type' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {incidents.map((incident) => (
                              <SelectItem
                                key={incident.id}
                                value={String(incident.id)}
                              >
                                {incident.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type='button'
                          variant='outline'
                          size='icon'
                          onClick={() => setIsAddIncidentOpen(true)}
                        >
                          <Plus className='h-4 w-4' />
                        </Button>
                      </div>

                      {/* Display selected incidents */}
                      {field.value.length > 0 && (
                        <div className='mt-2 space-y-2'>
                          <p className='text-sm font-medium'>
                            Selected incidents:
                          </p>
                          <ul className='text-sm space-y-1'>
                            {field.value.map((incident) => (
                              <li
                                key={incident.id}
                                className='flex justify-between items-center p-2 bg-gray-50 rounded'
                              >
                                <span>{incident.description}</span>
                                <Button
                                  type='button'
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => {
                                    field.onChange(
                                      field.value.filter(
                                        (item) => item.id !== incident.id
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

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='date_incident'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>Incident Date</FormLabel>
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
                                date > new Date() ||
                                date < new Date('1900-01-01')
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
                    name='time_incident'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incident Time</FormLabel>
                        <FormControl>
                          <Input type='time' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='section'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter section' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='location_incident'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Enter incident location'
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
                    name='date_reported'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>Date Reported</FormLabel>
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
                                date > new Date() ||
                                date < new Date('1900-01-01')
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
                    name='supervisor'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supervisor</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Enter supervisor name'
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
                    name='type'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select type' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='Employee'>Employee</SelectItem>
                            <SelectItem value='Subcontrator'>
                              Subcontractor
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {type === 'Employee' ? (
                    <FormField
                      control={form.control}
                      name='employee_name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter employee name'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name='subcontrator_name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subcontractor Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter subcontractor name'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <FormField
                  control={form.control}
                  name='incident_description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incident Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Describe the incident'
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
                  name='details_of_injured_person'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Details of Injured Person</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Enter details of injured person'
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
                  name='witness_statement'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Witness Statement</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Enter witness statement'
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
                  name='preliminary_findings'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preliminary Findings</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Enter preliminary findings'
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
                  name='recomendations'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recommendations</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Enter recommendations'
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
                    name='further_investigation_required'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Further Investigation Required</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='Yes'>Yes</SelectItem>
                            <SelectItem value='No'>No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='incident_reportable'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incident Reportable</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='Yes'>Yes</SelectItem>
                            <SelectItem value='No'>No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='lenders_to_be_notified'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lenders to be Notified</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='Yes'>Yes</SelectItem>
                            <SelectItem value='No'>No</SelectItem>
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
                    name='author_of_report'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author of Report</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter author name' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='approver_name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Approver Name</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter approver name' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='date_approved'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>Date Approved</FormLabel>
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
                                date > new Date() ||
                                date < new Date('1900-01-01')
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                  {report ? 'Updating...' : 'Creating...'}
                </>
              ) : report ? (
                'Update'
              ) : (
                'Create'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Incident Dialog */}
      <IncidentDialog
        open={isAddIncidentOpen}
        onOpenChange={setIsAddIncidentOpen}
        onClose={() => setIsAddIncidentOpen(false)}
        onSuccess={handleIncidentSuccess}
      />
    </>
  );
}
