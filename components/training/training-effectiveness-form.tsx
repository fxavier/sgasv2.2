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
import { TrainingEvaluationQuestionForm } from './training-evaluation-question-form';

const formSchema = z.object({
  training: z.string().min(2, 'Training must be at least 2 characters'),
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
  trainee: z.string().min(2, 'Trainee name must be at least 2 characters'),
  immediate_supervisor: z
    .string()
    .min(2, 'Supervisor name must be at least 2 characters'),
  training_evaluation_question: z.object({
    id: z.string(),
    question: z.string(),
  }),
  answer: z.enum(['Satisfactory', 'Partially Satisfactory', 'Unsatisfactory']),
  human_resource_evaluation: z.enum(['effective', 'ineffective']),
});

interface TrainingEffectivenessFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessment: TrainingEffectivnessAssessment | null;
  onClose: () => void;
}

export function TrainingEffectivenessAssessmentForm({
  open,
  onOpenChange,
  assessment,
  onClose,
}: TrainingEffectivenessFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [subprojects, setSubprojects] = useState<Subproject[]>([]);
  const [evaluationQuestions, setEvaluationQuestions] = useState<
    TrainingEvaluationQuestion[]
  >([]);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);

  // Fetch departments, subprojects, and evaluation questions
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

          // Fetch evaluation questions
          const questionsResponse = await fetch(
            '/api/training-evaluation-questions'
          );
          if (questionsResponse.ok) {
            const questionsData = await questionsResponse.json();
            setEvaluationQuestions(questionsData);
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
      training: assessment?.training || '',
      date: assessment?.date || format(new Date(), 'yyyy-MM-dd'),
      department: assessment?.department,
      subproject: assessment?.subproject,
      trainee: assessment?.trainee || '',
      immediate_supervisor: assessment?.immediate_supervisor || '',
      training_evaluation_question:
        assessment?.training_evaluation_question || undefined,
      answer: assessment?.answer || 'Satisfactory',
      human_resource_evaluation:
        assessment?.human_resource_evaluation || 'effective',
    },
  });

  // Update form when assessment changes
  useEffect(() => {
    if (assessment) {
      form.reset({
        training: assessment.training,
        date: assessment.date,
        department: assessment.department,
        subproject: assessment.subproject,
        trainee: assessment.trainee,
        immediate_supervisor: assessment.immediate_supervisor,
        training_evaluation_question: assessment.training_evaluation_question,
        answer: assessment.answer,
        human_resource_evaluation: assessment.human_resource_evaluation,
      });
    } else {
      form.reset({
        training: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        department: undefined,
        subproject: undefined,
        trainee: '',
        immediate_supervisor: '',
        training_evaluation_question:
          evaluationQuestions.length > 0 ? evaluationQuestions[0] : undefined,
        answer: 'Satisfactory',
        human_resource_evaluation: 'effective',
      });
    }
  }, [assessment, form, evaluationQuestions]);

  const handleQuestionSuccess = async () => {
    try {
      // Fetch updated evaluation questions
      const response = await fetch('/api/training-evaluation-questions');
      if (response.ok) {
        const data = await response.json();
        setEvaluationQuestions(data);

        // If there are questions and none is selected, select the first one
        if (
          data.length > 0 &&
          !form.getValues('training_evaluation_question')
        ) {
          form.setValue('training_evaluation_question', data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching evaluation questions:', error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (assessment) {
        // Update existing assessment
        const response = await fetch(
          `/api/training-effectiveness/${assessment.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update training effectiveness assessment');
        }

        toast({
          title: 'Assessment updated',
          description:
            'The training effectiveness assessment has been successfully updated.',
        });
      } else {
        // Create new assessment
        const response = await fetch('/api/training-effectiveness', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to create training effectiveness assessment');
        }

        toast({
          title: 'Assessment created',
          description:
            'The training effectiveness assessment has been successfully created.',
        });
      }

      form.reset();
      onClose();
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: 'Error',
        description:
          'There was an error saving the assessment. Please try again.',
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
              {assessment
                ? 'Edit Training Effectiveness Assessment'
                : 'Create Training Effectiveness Assessment'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
              </div>

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

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='trainee'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trainee</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter trainee name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='immediate_supervisor'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Immediate Supervisor</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter supervisor name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='training_evaluation_question'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Evaluation Question</FormLabel>
                    <div className='flex gap-2'>
                      <Select
                        onValueChange={(value) => {
                          const selected = evaluationQuestions.find(
                            (q) => q.id === value
                          );
                          field.onChange(selected);
                        }}
                        value={field.value?.id}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select question' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {evaluationQuestions.map((q) => (
                            <SelectItem key={q.id} value={q.id}>
                              {q.question}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() => setIsAddQuestionOpen(true)}
                      >
                        <Plus className='h-4 w-4' />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='answer'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select answer' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='Satisfactory'>
                            Satisfactory
                          </SelectItem>
                          <SelectItem value='Partially Satisfactory'>
                            Partially Satisfactory
                          </SelectItem>
                          <SelectItem value='Unsatisfactory'>
                            Unsatisfactory
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='human_resource_evaluation'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HR Evaluation</FormLabel>
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
                          <SelectItem value='effective'>Effective</SelectItem>
                          <SelectItem value='ineffective'>
                            Ineffective
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                      {assessment ? 'Updating...' : 'Creating...'}
                    </>
                  ) : assessment ? (
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

      {/* Training Evaluation Question Form */}
      <TrainingEvaluationQuestionForm
        open={isAddQuestionOpen}
        onOpenChange={setIsAddQuestionOpen}
        onClose={() => setIsAddQuestionOpen(false)}
        onSuccess={handleQuestionSuccess}
      />
    </>
  );
}
