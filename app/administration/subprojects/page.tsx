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

interface Subproject {
  id: string;
  name: string;
  contractReference?: string;
  contractorName?: string;
  estimatedCost?: number;
  location: string;
  geographicCoordinates?: string;
  type: string;
  approximateArea: string;
}

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  contractReference: z.string().optional(),
  contractorName: z.string().optional(),
  estimatedCost: z.string().optional(),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  geographicCoordinates: z.string().optional(),
  type: z.string().min(2, 'Type must be at least 2 characters'),
  approximateArea: z
    .string()
    .min(2, 'Approximate area must be at least 2 characters'),
});

export default function SubprojectsPage() {
  const [subprojects, setSubprojects] = useState<Subproject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubproject, setEditingSubproject] = useState<Subproject | null>(
    null
  );
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      contractReference: '',
      contractorName: '',
      estimatedCost: '',
      location: '',
      geographicCoordinates: '',
      type: '',
      approximateArea: '',
    },
  });

  // Fetch subprojects
  const fetchSubprojects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/subprojects');
      if (!response.ok) {
        throw new Error('Failed to fetch subprojects');
      }
      const data = await response.json();
      setSubprojects(data);
    } catch (error) {
      console.error('Error fetching subprojects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subprojects. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubprojects();
  }, []);

  // Update form when editing a subproject
  useEffect(() => {
    if (editingSubproject) {
      form.reset({
        name: editingSubproject.name,
        contractReference: editingSubproject.contractReference || '',
        contractorName: editingSubproject.contractorName || '',
        estimatedCost: editingSubproject.estimatedCost?.toString() || '',
        location: editingSubproject.location,
        geographicCoordinates: editingSubproject.geographicCoordinates || '',
        type: editingSubproject.type,
        approximateArea: editingSubproject.approximateArea,
      });
    } else {
      form.reset({
        name: '',
        contractReference: '',
        contractorName: '',
        estimatedCost: '',
        location: '',
        geographicCoordinates: '',
        type: '',
        approximateArea: '',
      });
    }
  }, [editingSubproject, form]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/subprojects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete subproject');
      }

      setSubprojects(subprojects.filter((subproject) => subproject.id !== id));
      toast({
        title: 'Subproject deleted',
        description: 'The subproject has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting subproject:', error);
      toast({
        title: 'Error',
        description:
          error.message || 'Failed to delete subproject. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (editingSubproject) {
        // Update existing subproject
        const response = await fetch(
          `/api/subprojects/${editingSubproject.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update subproject');
        }

        toast({
          title: 'Subproject updated',
          description: 'The subproject has been successfully updated.',
        });
      } else {
        // Create new subproject
        const response = await fetch('/api/subprojects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to create subproject');
        }

        toast({
          title: 'Subproject created',
          description: 'The subproject has been successfully created.',
        });
      }

      // Refresh the list and close the form
      fetchSubprojects();
      setIsFormOpen(false);
      setEditingSubproject(null);
      form.reset();
    } catch (error) {
      console.error('Error saving subproject:', error);
      toast({
        title: 'Error',
        description:
          'There was an error saving the subproject. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Filter subprojects based on search query
  const filteredSubprojects = subprojects.filter(
    (subproject) =>
      subproject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subproject.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subproject.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='container mx-auto max-w-7xl px-4 py-6 space-y-8'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Subproject Management
          </h1>
          <p className='text-gray-500 mt-2'>Manage and track subprojects</p>
        </div>
        <Button
          onClick={() => {
            setEditingSubproject(null);
            setIsFormOpen(true);
          }}
          className='flex items-center gap-2 w-full sm:w-auto'
        >
          <Plus className='h-4 w-4' />
          Add Subproject
        </Button>
      </div>

      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search subprojects...'
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
              <span className='ml-2'>Loading subprojects...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[20%]'>Name</TableHead>
                  <TableHead className='w-[20%]'>Location</TableHead>
                  <TableHead className='w-[15%]'>Type</TableHead>
                  <TableHead className='w-[15%]'>Area</TableHead>
                  <TableHead className='w-[15%]'>Contractor</TableHead>
                  <TableHead className='w-[15%] text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubprojects.length > 0 ? (
                  filteredSubprojects.map((subproject) => (
                    <TableRow key={subproject.id}>
                      <TableCell className='font-medium'>
                        {subproject.name}
                      </TableCell>
                      <TableCell>{subproject.location}</TableCell>
                      <TableCell>{subproject.type}</TableCell>
                      <TableCell>{subproject.approximateArea}</TableCell>
                      <TableCell>
                        {subproject.contractorName || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                              setEditingSubproject(subproject);
                              setIsFormOpen(true);
                            }}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setDeleteId(subproject.id)}
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
                      colSpan={6}
                      className='text-center py-8 text-gray-500'
                    >
                      No subprojects found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Subproject Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>
              {editingSubproject ? 'Edit Subproject' : 'Create Subproject'}
            </DialogTitle>
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
                      <Input placeholder='Enter subproject name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='location'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter location' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='type'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter type' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='approximateArea'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Approximate Area</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter approximate area'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='geographicCoordinates'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Geographic Coordinates</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter coordinates (optional)'
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
                  name='contractReference'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract Reference</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter contract reference (optional)'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='contractorName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contractor Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter contractor name (optional)'
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
                name='estimatedCost'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Cost</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Enter estimated cost (optional)'
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
                    setEditingSubproject(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type='submit'>
                  {editingSubproject ? 'Update' : 'Create'}
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
              This action cannot be undone. This will permanently delete the
              subproject.
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
