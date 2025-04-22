'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Search, Loader2, Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
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
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define the EnvironmentalFactor interface if not already defined
interface EnvironmentalFactor {
  id?: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

const formSchema = z.object({
  description: z.string().min(5, 'Description must be at least 5 characters'),
});

export default function EnvironmentalFactorsPage() {
  const [factors, setFactors] = useState<EnvironmentalFactor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFactor, setEditingFactor] =
    useState<EnvironmentalFactor | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  });

  // Fetch environmental factors
  const fetchFactors = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/environmental-factors');
      if (!response.ok) {
        throw new Error('Failed to fetch environmental factors');
      }
      const data = await response.json();
      setFactors(data);
    } catch (error) {
      console.error('Error fetching factors:', error);
      toast({
        title: 'Error',
        description: 'Failed to load environmental factors. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFactors();
  }, []);

  // Update form when editing a factor
  useEffect(() => {
    if (editingFactor) {
      form.reset({
        description: editingFactor.description,
      });
    } else {
      form.reset({
        description: '',
      });
    }
  }, [editingFactor, form]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/environmental-factors/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Failed to delete environmental factor'
        );
      }

      setFactors(factors.filter((factor) => factor.id !== id));
      toast({
        title: 'Factor deleted',
        description: 'The environmental factor has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting factor:', error);
      toast({
        title: 'Error',
        description:
          error.message ||
          'Failed to delete environmental factor. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (editingFactor) {
        // Update existing factor
        const response = await fetch(
          `/api/environmental-factors/${editingFactor.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update environmental factor');
        }

        toast({
          title: 'Factor updated',
          description:
            'The environmental factor has been successfully updated.',
        });
      } else {
        // Create new factor
        const response = await fetch('/api/environmental-factors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to create environmental factor');
        }

        toast({
          title: 'Factor created',
          description:
            'The environmental factor has been successfully created.',
        });
      }

      // Refresh the list
      fetchFactors();

      // Close the form and reset
      setIsFormOpen(false);
      setEditingFactor(null);
      form.reset();
    } catch (error) {
      console.error('Error saving factor:', error);
      toast({
        title: 'Error',
        description:
          'There was an error saving the environmental factor. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Filter factors based on search query
  const filteredFactors = factors.filter((factor) =>
    factor.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='container mx-auto max-w-7xl px-4 py-6 space-y-8'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Environmental Factors
          </h1>
          <p className='text-gray-500 mt-2'>
            Manage environmental factors for impact assessments
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingFactor(null);
            setIsFormOpen(true);
          }}
          className='flex items-center gap-2 w-full sm:w-auto'
        >
          <Plus className='h-4 w-4' />
          Add Environmental Factor
        </Button>
      </div>

      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search environmental factors...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <div className='min-w-full'>
          {isLoading ? (
            <div className='flex justify-center items-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <span className='ml-2'>Loading environmental factors...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[70%]'>Description</TableHead>
                  <TableHead className='w-[15%]'>Created At</TableHead>
                  <TableHead className='w-[15%] text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFactors.length > 0 ? (
                  filteredFactors.map((factor) => (
                    <TableRow key={factor.id}>
                      <TableCell className='font-medium'>
                        {factor.description}
                      </TableCell>
                      <TableCell>
                        {new Date(factor.createdAt!).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                              setEditingFactor(factor);
                              setIsFormOpen(true);
                            }}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => factor.id && setDeleteId(factor.id)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className='text-center py-8 text-gray-500'
                    >
                      No environmental factors found matching your search
                      criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Environmental Factor Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>
              {editingFactor
                ? 'Edit Environmental Factor'
                : 'Add Environmental Factor'}
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
                      <Textarea
                        placeholder='Enter environmental factor description'
                        className='min-h-[100px]'
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
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingFactor(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type='submit'>
                  {editingFactor ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => !isDeleting && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              environmental factor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className='bg-red-600 hover:bg-red-700'
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
