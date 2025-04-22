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
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  description: z.string().min(2, 'Description must be at least 2 characters'),
  goals: z.string().min(2, 'Goals must be at least 2 characters'),
  strategies_for_achievement: z
    .string()
    .min(10, 'Strategies must be at least 10 characters'),
});

interface StrategicObjectiveFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  objective: StrategicObjective | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function StrategicObjectiveForm({
  open,
  onOpenChange,
  objective,
  onClose,
  onSuccess,
}: StrategicObjectiveFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: objective?.description || '',
      goals: objective?.goals || '',
      strategies_for_achievement: objective?.strategies_for_achievement || '',
    },
  });

  // Update form when objective changes
  useEffect(() => {
    if (objective) {
      form.reset({
        description: objective.description,
        goals: objective.goals,
        strategies_for_achievement: objective.strategies_for_achievement,
      });
    } else {
      form.reset({
        description: '',
        goals: '',
        strategies_for_achievement: '',
      });
    }
  }, [objective, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (objective) {
        // Update existing objective
        const response = await fetch(
          `/api/strategic-objectives/${objective.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update strategic objective');
        }

        toast({
          title: 'Objective updated',
          description: 'The strategic objective has been successfully updated.',
        });
      } else {
        // Create new objective
        const response = await fetch('/api/strategic-objectives', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to create strategic objective');
        }

        toast({
          title: 'Objective created',
          description: 'The strategic objective has been successfully created.',
        });
      }

      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving strategic objective:', error);
      toast({
        title: 'Error',
        description:
          'There was an error saving the strategic objective. Please try again.',
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
            {objective
              ? 'Edit Strategic Objective'
              : 'Create Strategic Objective'}
          </DialogTitle>
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
                    <Input placeholder='Enter description' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='goals'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goals</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter goals' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='strategies_for_achievement'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strategies for Achievement</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe strategies for achievement'
                      className='resize-none'
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
                    {objective ? 'Updating...' : 'Creating...'}
                  </>
                ) : objective ? (
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
