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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  contact: z.string().min(2, 'Contact must be at least 2 characters'),
  date: z.string(),
  signature: z.string().optional(),
});

export default function ResponsibleFillingPage() {
  const [responsibles, setResponsibles] = useState<ResponsibleForFillingForm[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResponsible, setEditingResponsible] =
    useState<ResponsibleForFillingForm | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      role: '',
      contact: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      signature: '',
    },
  });

  // Fetch responsible persons
  const fetchResponsibles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/responsible-persons');
      if (!response.ok) {
        throw new Error('Failed to fetch responsible persons');
      }
      const data = await response.json();
      setResponsibles(data);
    } catch (error) {
      console.error('Error fetching responsible persons:', error);
      toast({
        title: 'Error',
        description: 'Failed to load responsible persons. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResponsibles();
  }, []);

  // Update form when editing a responsible person
  useEffect(() => {
    if (editingResponsible) {
      form.reset({
        name: editingResponsible.name,
        role: editingResponsible.role,
        contact: editingResponsible.contact,
        date: editingResponsible.date
          ? format(new Date(editingResponsible.date), 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd'),
        signature: editingResponsible.signature || '',
      });
    } else {
      form.reset({
        name: '',
        role: '',
        contact: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        signature: '',
      });
    }
  }, [editingResponsible, form]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/responsible-persons/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Failed to delete responsible person'
        );
      }

      setResponsibles(
        responsibles.filter((responsible) => responsible.id !== id)
      );
      toast({
        title: 'Responsible person deleted',
        description: 'The responsible person has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting responsible person:', error);
      toast({
        title: 'Error',
        description:
          error.message ||
          'Failed to delete responsible person. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (editingResponsible) {
        // Update existing responsible person
        const response = await fetch(
          `/api/responsible-persons/${editingResponsible.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update responsible person');
        }

        toast({
          title: 'Responsible person updated',
          description: 'The responsible person has been successfully updated.',
        });
      } else {
        // Create new responsible person
        const response = await fetch('/api/responsible-persons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to create responsible person');
        }

        toast({
          title: 'Responsible person created',
          description: 'The responsible person has been successfully created.',
        });
      }

      // Refresh the list
      fetchResponsibles();

      // Close the form and reset
      setIsFormOpen(false);
      setEditingResponsible(null);
      form.reset();
    } catch (error) {
      console.error('Error saving responsible person:', error);
      toast({
        title: 'Error',
        description:
          'There was an error saving the responsible person. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Filter responsibles based on search query
  const filteredResponsibles = responsibles.filter(
    (responsible) =>
      responsible.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      responsible.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      responsible.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='container mx-auto max-w-7xl px-4 py-6 space-y-8'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Responsible for Filling Form
          </h1>
          <p className='text-gray-500 mt-2'>
            Manage persons responsible for filling forms
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingResponsible(null);
            setIsFormOpen(true);
          }}
          className='flex items-center gap-2 w-full sm:w-auto'
        >
          <Plus className='h-4 w-4' />
          Add Responsible Person
        </Button>
      </div>

      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search responsible persons...'
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
              <span className='ml-2'>Loading responsible persons...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[25%]'>Name</TableHead>
                  <TableHead className='w-[20%]'>Role</TableHead>
                  <TableHead className='w-[20%]'>Contact</TableHead>
                  <TableHead className='w-[15%]'>Date</TableHead>
                  <TableHead className='w-[10%]'>Signature</TableHead>
                  <TableHead className='w-[10%] text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResponsibles.length > 0 ? (
                  filteredResponsibles.map((responsible) => (
                    <TableRow key={responsible.id}>
                      <TableCell className='font-medium'>
                        {responsible.name}
                      </TableCell>
                      <TableCell>{responsible.role}</TableCell>
                      <TableCell>{responsible.contact}</TableCell>
                      <TableCell>
                        {new Date(responsible.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{responsible.signature || 'N/A'}</TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                              setEditingResponsible(responsible);
                              setIsFormOpen(true);
                            }}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setDeleteId(responsible.id)}
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
                      No responsible persons found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Responsible Person Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>
              {editingResponsible
                ? 'Edit Responsible Person'
                : 'Add Responsible Person'}
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
                      <Input placeholder='Enter name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter role' {...field} />
                    </FormControl>
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
                name='signature'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Signature (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter signature' {...field} />
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
                    setEditingResponsible(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type='submit'>
                  {editingResponsible ? 'Update' : 'Create'}
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
              responsible person.
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
