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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';

const formSchema = z.object({
  number: z.string().min(1, 'Number is required'),
  department: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
  subproject: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
  non_compliance_description: z
    .string()
    .min(10, 'Description must be at least 10 characters'),
  identified_causes: z
    .string()
    .min(10, 'Causes must be at least 10 characters'),
  corrective_actions: z
    .string()
    .min(10, 'Actions must be at least 10 characters'),
  responsible_person: z
    .string()
    .min(2, 'Responsible person must be at least 2 characters'),
  deadline: z.string(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  effectiveness_evaluation: z.enum(['EFFECTIVE', 'NOT_EFFECTIVE']),
  responsible_person_evaluation: z
    .string()
    .min(2, 'Evaluator must be at least 2 characters'),
  observation: z.string().optional(),
});

interface NonComplianceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  compliance: NonComplianceControl | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function NonComplianceForm({
  open,
  onOpenChange,
  compliance,
  onClose,
  onSuccess,
}: NonComplianceFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [subprojects, setSubprojects] = useState<Subproject[]>([]);

  // Fetch departments and subprojects
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // Fetch departments
          const deptResponse = await fetch('/api/departments');
          if (deptResponse.ok) {
            const deptData = await deptResponse.json();
            setDepartments(deptData);
          }

          // Fetch subprojects
          const subprojResponse = await fetch('/api/subprojects');
          if (subprojResponse.ok) {
            const subprojData = await subprojResponse.json();
            setSubprojects(subprojData);
          }
        } catch (error) {
          console.error('Error fetching form data:', error);
          toast({
            title: 'Error',
            description: 'Failed to load form data. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [open, toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: compliance?.number || '',
      department: compliance?.department,
      subproject: compliance?.subproject,
      non_compliance_description: compliance?.non_compliance_description || '',
      identified_causes: compliance?.identified_causes || '',
      corrective_actions: compliance?.corrective_actions || '',
      responsible_person: compliance?.responsible_person || '',
      deadline: compliance?.deadline || format(new Date(), 'yyyy-MM-dd'),
      status: compliance?.status || 'PENDING',
      effectiveness_evaluation:
        compliance?.effectiveness_evaluation || 'NOT_EFFECTIVE',
      responsible_person_evaluation:
        compliance?.responsible_person_evaluation || '',
      observation: compliance?.observation || '',
    },
  });

  // Update form when compliance changes
  useEffect(() => {
    if (compliance) {
      form.reset({
        number: compliance.number,
        department: compliance.department,
        subproject: compliance.subproject,
        non_compliance_description: compliance.non_compliance_description,
        identified_causes: compliance.identified_causes,
        corrective_actions: compliance.corrective_actions,
        responsible_person: compliance.responsible_person,
        deadline: compliance.deadline,
        status: compliance.status,
        effectiveness_evaluation: compliance.effectiveness_evaluation,
        responsible_person_evaluation: compliance.responsible_person_evaluation,
        observation: compliance.observation,
      });
    } else {
      form.reset({
        number: '',
        department: undefined,
        subproject: undefined,
        non_compliance_description: '',
        identified_causes: '',
        corrective_actions: '',
        responsible_person: '',
        deadline: format(new Date(), 'yyyy-MM-dd'),
        status: 'PENDING',
        effectiveness_evaluation: 'NOT_EFFECTIVE',
        responsible_person_evaluation: '',
        observation: '',
      });
    }
  }, [compliance, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (compliance) {
        // Update existing non-compliance record
        const response = await fetch(`/api/non-compliance/${compliance.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Failed to update non-compliance record'
          );
        }

        toast({
          title: 'Record updated',
          description:
            'The non-compliance record has been successfully updated.',
        });
      } else {
        // Create new non-compliance record
        const response = await fetch('/api/non-compliance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Failed to create non-compliance record'
          );
        }

        toast({
          title: 'Record created',
          description:
            'The non-compliance record has been successfully created.',
        });
      }

      form.reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving non-compliance record:', error);
      toast({
        title: 'Error',
        description:
          error.message ||
          'There was an error saving the non-compliance record. Please try again.',
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[800px] h-[90vh] flex flex-col p-0'>
        <DialogHeader className='px-6 py-4 border-b'>
          <DialogTitle>
            {compliance
              ? 'Edit Non-Compliance Record'
              : 'Create Non-Compliance Record'}
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
                  name='department'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const selected = departments.find(
                            (dept) => dept.id === value
                          );
                          field.onChange(selected);
                        }}
                        value={field.value?.id}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select department' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id || ''}>
                              {dept.name}
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
                  name='subproject'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subproject</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const selected = subprojects.find(
                            (proj) => proj.id === value
                          );
                          field.onChange(selected);
                        }}
                        value={field.value?.id}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select subproject' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subprojects.map((proj) => (
                            <SelectItem key={proj.id} value={proj.id}>
                              {proj.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='non_compliance_description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Non-Compliance Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Describe the non-compliance'
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
                name='identified_causes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identified Causes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Describe the identified causes'
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
                name='corrective_actions'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Corrective Actions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Describe the corrective actions'
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
                  name='responsible_person'
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

                <FormField
                  control={form.control}
                  name='deadline'
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
                  name='status'
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

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='effectiveness_evaluation'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Effectiveness Evaluation</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select evaluation' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='EFFECTIVE'>Effective</SelectItem>
                          <SelectItem value='NOT_EFFECTIVE'>
                            Not Effective
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='responsible_person_evaluation'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsible Person for Evaluation</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter evaluator name' {...field} />
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
                {compliance ? 'Updating...' : 'Creating...'}
              </>
            ) : compliance ? (
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
