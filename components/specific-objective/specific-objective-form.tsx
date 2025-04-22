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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  strategic_objective: z
    .string()
    .min(2, 'Strategic objective must be at least 2 characters'),
  specific_objective: z
    .string()
    .min(2, 'Specific objective must be at least 2 characters'),
  actions_for_achievement: z
    .string()
    .min(10, 'Actions must be at least 10 characters'),
  responsible_person: z
    .string()
    .min(2, 'Responsible person must be at least 2 characters'),
  necessary_resources: z
    .string()
    .min(2, 'Necessary resources must be at least 2 characters'),
  indicator: z.string().min(2, 'Indicator must be at least 2 characters'),
  goal: z.string().min(2, 'Goal must be at least 2 characters'),
  monitoring_frequency: z
    .string()
    .min(2, 'Monitoring frequency must be at least 2 characters'),
  deadline: z.string(),
  observation: z.string().optional(),
});

interface SpecificObjectiveFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  objective: SpecificObjective | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function SpecificObjectiveForm({
  open,
  onOpenChange,
  objective,
  onClose,
  onSuccess,
}: SpecificObjectiveFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [strategicObjectives, setStrategicObjectives] = useState<
    StrategicObjective[]
  >([]);

  // Fetch strategic objectives for dropdown
  useEffect(() => {
    if (open) {
      const fetchStrategicObjectives = async () => {
        try {
          setIsLoading(true);
          const response = await fetch('/api/strategic-objectives');
          if (!response.ok) {
            throw new Error('Failed to fetch strategic objectives');
          }
          const data = await response.json();
          setStrategicObjectives(data);
        } catch (error) {
          console.error('Error fetching strategic objectives:', error);
          toast({
            title: 'Error',
            description:
              'Failed to load strategic objectives. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchStrategicObjectives();
    }
  }, [open, toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      strategic_objective: objective?.strategic_objective || '',
      specific_objective: objective?.specific_objective || '',
      actions_for_achievement: objective?.actions_for_achievement || '',
      responsible_person: objective?.responsible_person || '',
      necessary_resources: objective?.necessary_resources || '',
      indicator: objective?.indicator || '',
      goal: objective?.goal || '',
      monitoring_frequency: objective?.monitoring_frequency || '',
      deadline: objective?.deadline || format(new Date(), 'yyyy-MM-dd'),
      observation: objective?.observation || '',
    },
  });

  // Update form when objective changes
  useEffect(() => {
    if (objective) {
      form.reset({
        strategic_objective: objective.strategic_objective,
        specific_objective: objective.specific_objective,
        actions_for_achievement: objective.actions_for_achievement,
        responsible_person: objective.responsible_person,
        necessary_resources: objective.necessary_resources,
        indicator: objective.indicator,
        goal: objective.goal,
        monitoring_frequency: objective.monitoring_frequency,
        deadline: objective.deadline,
        observation: objective.observation,
      });
    } else {
      form.reset({
        strategic_objective: '',
        specific_objective: '',
        actions_for_achievement: '',
        responsible_person: '',
        necessary_resources: '',
        indicator: '',
        goal: '',
        monitoring_frequency: '',
        deadline: format(new Date(), 'yyyy-MM-dd'),
        observation: '',
      });
    }
  }, [objective, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (objective) {
        // Update existing objective
        const response = await fetch(
          `/api/specific-objectives/${objective.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update specific objective');
        }

        toast({
          title: 'Objective updated',
          description: 'The specific objective has been successfully updated.',
        });
      } else {
        // Create new objective
        const response = await fetch('/api/specific-objectives', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to create specific objective');
        }

        toast({
          title: 'Objective created',
          description: 'The specific objective has been successfully created.',
        });
      }

      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving specific objective:', error);
      toast({
        title: 'Error',
        description:
          'There was an error saving the specific objective. Please try again.',
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
            {objective
              ? 'Edit Specific Objective'
              : 'Create Specific Objective'}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className='flex-1 p-6'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                  control={form.control}
                  name='strategic_objective'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strategic Objective</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select strategic objective' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {strategicObjectives.map((obj) => (
                            <SelectItem key={obj.id} value={obj.description}>
                              {obj.description}
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
                  name='specific_objective'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specific Objective</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter specific objective'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='actions_for_achievement'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actions for Achievement</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Describe actions for achievement'
                        className='min-h-[100px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
                  name='necessary_resources'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Necessary Resources</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter necessary resources'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                  control={form.control}
                  name='indicator'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indicator</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter indicator' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='goal'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter goal' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                  control={form.control}
                  name='monitoring_frequency'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monitoring Frequency</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter monitoring frequency'
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
              </div>

              <FormField
                control={form.control}
                name='observation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Add observation'
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
                {objective ? 'Updating...' : 'Creating...'}
              </>
            ) : objective ? (
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
