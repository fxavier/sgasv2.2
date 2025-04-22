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
import { PositionForm } from './position-form';

const formSchema = z.object({
  date: z.string().optional(),
  position: z.object({
    id: z.string(),
    name: z.string(),
  }),
  training: z.object({
    id: z.string(),
    name: z.string(),
  }),
  toolbox_talks: z.object({
    id: z.string(),
    name: z.string(),
  }),
  effectiveness: z.enum(['Effective', 'Not effective']),
  actions_training_not_effective: z.string().optional(),
  approved_by: z.string().min(2, 'Approver name must be at least 2 characters'),
});

// Form for adding new training
const trainingFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

// Form for adding new toolbox talk
const toolboxTalkFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

interface TrainingMatrixFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matrix: TrainingMatrix | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Training Dialog Component
function TrainingDialog({
  open,
  onOpenChange,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof trainingFormSchema>>({
    resolver: zodResolver(trainingFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof trainingFormSchema>) => {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/trainings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to create training');
      }

      toast({
        title: 'Training created',
        description: 'The training has been successfully created.',
      });

      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating training:', error);
      toast({
        title: 'Error',
        description:
          'There was an error creating the training. Please try again.',
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
          <DialogTitle>Create Training</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Training name' {...field} />
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

// Toolbox Talk Dialog Component
function ToolboxTalkDialog({
  open,
  onOpenChange,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof toolboxTalkFormSchema>>({
    resolver: zodResolver(toolboxTalkFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof toolboxTalkFormSchema>) => {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/toolbox-talks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to create toolbox talk');
      }

      toast({
        title: 'Toolbox talk created',
        description: 'The toolbox talk has been successfully created.',
      });

      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating toolbox talk:', error);
      toast({
        title: 'Error',
        description:
          'There was an error creating the toolbox talk. Please try again.',
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
          <DialogTitle>Create Toolbox Talk</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Toolbox talk name' {...field} />
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

export function TrainingMatrixForm({
  open,
  onOpenChange,
  matrix,
  onClose,
  onSuccess,
}: TrainingMatrixFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for dropdown data
  const [positions, setPositions] = useState<Position[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [toolboxTalks, setToolboxTalks] = useState<ToolBoxTalks[]>([]);

  // State for add dialogs
  const [isAddPositionOpen, setIsAddPositionOpen] = useState(false);
  const [isAddTrainingOpen, setIsAddTrainingOpen] = useState(false);
  const [isAddToolboxTalkOpen, setIsAddToolboxTalkOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: matrix?.date || format(new Date(), 'yyyy-MM-dd'),
      position: matrix?.position || undefined,
      training: matrix?.training || undefined,
      toolbox_talks: matrix?.toolbox_talks || undefined,
      effectiveness: matrix?.effectiveness || 'Effective',
      actions_training_not_effective:
        matrix?.actions_training_not_effective || '',
      approved_by: matrix?.approved_by || '',
    },
  });

  // Fetch all necessary data when the form opens
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // Fetch positions
          const posResponse = await fetch('/api/positions');
          if (posResponse.ok) {
            const posData = await posResponse.json();
            setPositions(posData);
          }

          // Fetch trainings
          const trainResponse = await fetch('/api/trainings');
          if (trainResponse.ok) {
            const trainData = await trainResponse.json();
            setTrainings(trainData);
          }

          // Fetch toolbox talks
          const toolboxResponse = await fetch('/api/toolbox-talks');
          if (toolboxResponse.ok) {
            const toolboxData = await toolboxResponse.json();
            setToolboxTalks(toolboxData);
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

  // Update form when matrix changes
  useEffect(() => {
    if (matrix) {
      form.reset({
        date: matrix.date,
        position: matrix.position,
        training: matrix.training,
        toolbox_talks: matrix.toolbox_talks,
        effectiveness: matrix.effectiveness,
        actions_training_not_effective: matrix.actions_training_not_effective,
        approved_by: matrix.approved_by,
      });
    } else {
      form.reset({
        date: format(new Date(), 'yyyy-MM-dd'),
        position: undefined,
        training: undefined,
        toolbox_talks: undefined,
        effectiveness: 'Effective',
        actions_training_not_effective: '',
        approved_by: '',
      });
    }
  }, [matrix, form]);

  const effectiveness = form.watch('effectiveness');

  const handlePositionSuccess = async () => {
    try {
      const response = await fetch('/api/positions');
      if (response.ok) {
        const data = await response.json();
        setPositions(data);
      }
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };

  const handleTrainingSuccess = async () => {
    try {
      const response = await fetch('/api/trainings');
      if (response.ok) {
        const data = await response.json();
        setTrainings(data);
      }
    } catch (error) {
      console.error('Error fetching trainings:', error);
    }
  };

  const handleToolboxTalkSuccess = async () => {
    try {
      const response = await fetch('/api/toolbox-talks');
      if (response.ok) {
        const data = await response.json();
        setToolboxTalks(data);
      }
    } catch (error) {
      console.error('Error fetching toolbox talks:', error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (matrix) {
        // Update existing matrix entry
        const response = await fetch(`/api/training-matrix/${matrix.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to update training matrix entry');
        }

        toast({
          title: 'Matrix entry updated',
          description:
            'The training matrix entry has been successfully updated.',
        });
      } else {
        // Create new matrix entry
        const response = await fetch('/api/training-matrix', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to create training matrix entry');
        }

        toast({
          title: 'Matrix entry created',
          description:
            'The training matrix entry has been successfully created.',
        });
      }

      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving training matrix entry:', error);
      toast({
        title: 'Error',
        description:
          'There was an error saving the training matrix entry. Please try again.',
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
              {matrix
                ? 'Edit Training Matrix Entry'
                : 'Create Training Matrix Entry'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(
                              date ? format(date, 'yyyy-MM-dd') : undefined
                            )
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
                name='position'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <div className='flex gap-2'>
                      <Select
                        onValueChange={(value) => {
                          const selected = positions.find(
                            (pos) => pos.id === value
                          );
                          field.onChange(selected);
                        }}
                        value={field.value?.id}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select position' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {positions.map((pos) => (
                            <SelectItem key={pos.id} value={pos.id}>
                              {pos.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() => setIsAddPositionOpen(true)}
                      >
                        <Plus className='h-4 w-4' />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='training'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Training</FormLabel>
                    <div className='flex gap-2'>
                      <Select
                        onValueChange={(value) => {
                          const selected = trainings.find(
                            (t) => t.id === value
                          );
                          field.onChange(selected);
                        }}
                        value={field.value?.id}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select training' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {trainings.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() => setIsAddTrainingOpen(true)}
                      >
                        <Plus className='h-4 w-4' />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='toolbox_talks'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Toolbox Talks</FormLabel>
                    <div className='flex gap-2'>
                      <Select
                        onValueChange={(value) => {
                          const selected = toolboxTalks.find(
                            (t) => t.id === value
                          );
                          field.onChange(selected);
                        }}
                        value={field.value?.id}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select toolbox talk' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {toolboxTalks.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() => setIsAddToolboxTalkOpen(true)}
                      >
                        <Plus className='h-4 w-4' />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='effectiveness'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Effectiveness</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select effectiveness' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Effective'>Effective</SelectItem>
                        <SelectItem value='Not effective'>
                          Not effective
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {effectiveness === 'Not effective' && (
                <FormField
                  control={form.control}
                  name='actions_training_not_effective'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Actions for Not Effective Training</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Describe actions to be taken'
                          className='resize-none'
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
                name='approved_by'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approved By</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter approver name' {...field} />
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
                      {matrix ? 'Updating...' : 'Creating...'}
                    </>
                  ) : matrix ? (
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

      {/* Add Position Dialog */}
      <PositionForm
        open={isAddPositionOpen}
        onOpenChange={setIsAddPositionOpen}
        onClose={() => setIsAddPositionOpen(false)}
        onSuccess={handlePositionSuccess}
      />

      {/* Add Training Dialog */}
      <TrainingDialog
        open={isAddTrainingOpen}
        onOpenChange={setIsAddTrainingOpen}
        onClose={() => setIsAddTrainingOpen(false)}
        onSuccess={handleTrainingSuccess}
      />

      {/* Add Toolbox Talk Dialog */}
      <ToolboxTalkDialog
        open={isAddToolboxTalkOpen}
        onOpenChange={setIsAddToolboxTalkOpen}
        onClose={() => setIsAddToolboxTalkOpen(false)}
        onSuccess={handleToolboxTalkSuccess}
      />
    </>
  );
}
