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
  filled_by: z.string().min(2, 'Name must be at least 2 characters'),
  date: z.string(),
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
  training: z.string().min(2, 'Training must be at least 2 characters'),
  training_objective: z
    .string()
    .min(10, 'Training objective must be at least 10 characters'),
  proposal_of_training_entity: z
    .string()
    .min(2, 'Training entity must be at least 2 characters'),
  potential_training_participants: z
    .string()
    .min(2, 'Participants must be at least 2 characters'),
});

interface TrainingNeedsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  need: TrainingNeeds | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function TrainingNeedsForm({
  open,
  onOpenChange,
  need,
  onClose,
  onSuccess,
}: TrainingNeedsFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [subprojects, setSubprojects] = useState<Subproject[]>([]);

  // Fetch departments and subprojects when the form opens
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
      filled_by: need?.filled_by || '',
      date: need?.date || format(new Date(), 'yyyy-MM-dd'),
      department: need?.department,
      subproject: need?.subproject,
      training: need?.training || '',
      training_objective: need?.training_objective || '',
      proposal_of_training_entity: need?.proposal_of_training_entity || '',
      potential_training_participants:
        need?.potential_training_participants || '',
    },
  });

  // Update form when need changes
  useEffect(() => {
    if (need) {
      form.reset({
        filled_by: need.filled_by,
        date: need.date,
        department: need.department,
        subproject: need.subproject,
        training: need.training,
        training_objective: need.training_objective,
        proposal_of_training_entity: need.proposal_of_training_entity,
        potential_training_participants: need.potential_training_participants,
      });
    } else {
      form.reset({
        filled_by: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        department: undefined,
        subproject: undefined,
        training: '',
        training_objective: '',
        proposal_of_training_entity: '',
        potential_training_participants: '',
      });
    }
  }, [need, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (need) {
        // Update existing training need
        const response = await fetch(`/api/training-needs/${need.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to update training need');
        }

        toast({
          title: 'Training need updated',
          description: 'The training need has been successfully updated.',
        });
      } else {
        // Create new training need
        const response = await fetch('/api/training-needs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to create training need');
        }

        toast({
          title: 'Training need created',
          description: 'The training need has been successfully created.',
        });
      }

      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving training need:', error);
      toast({
        title: 'Error',
        description:
          'There was an error saving the training need. Please try again.',
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] h-[90vh] flex flex-col p-0'>
        <DialogHeader className='px-6 py-4 border-b'>
          <DialogTitle>
            {need ? 'Edit Training Need' : 'Create Training Need'}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className='flex-1 p-6'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                  control={form.control}
                  name='filled_by'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Filled By</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter name' {...field} />
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

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
                        value={field.value?.id || ''}
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
                name='training'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Training</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter training name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='training_objective'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Training Objective</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter training objective'
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
                name='proposal_of_training_entity'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proposed Training Entity</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter proposed training entity'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='potential_training_participants'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potential Training Participants</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter potential participants'
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
                {need ? 'Updating...' : 'Creating...'}
              </>
            ) : need ? (
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
