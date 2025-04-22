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
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Define the AccoesImediatasECorrectivas interface if not already defined
interface AccoesImediatasECorrectivas {
  id?: string;
  accao: string;
  descricao: string;
  responsavel: string;
  data: string;
  assinatura: string;
  created_at?: string;
  updated_at?: string;
}

const formSchema = z.object({
  accao: z.string().min(2, 'Action must be at least 2 characters'),
  descricao: z.string().min(5, 'Description must be at least 5 characters'),
  responsavel: z
    .string()
    .min(2, 'Responsible person must be at least 2 characters'),
  data: z.string(),
  assinatura: z.string().min(2, 'Signature must be at least 2 characters'),
});

export default function AcoesImediatasPage() {
  const [actions, setActions] = useState<AccoesImediatasECorrectivas[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAction, setEditingAction] =
    useState<AccoesImediatasECorrectivas | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accao: '',
      descricao: '',
      responsavel: '',
      data: format(new Date(), 'yyyy-MM-dd'),
      assinatura: '',
    },
  });

  // Fetch actions
  const fetchActions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/acoes-imediatas');
      if (!response.ok) {
        throw new Error('Failed to fetch acoes imediatas');
      }
      const data = await response.json();
      setActions(data);
    } catch (error) {
      console.error('Error fetching actions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load acoes imediatas. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  // Update form when editing an action
  useEffect(() => {
    if (editingAction) {
      form.reset({
        accao: editingAction.accao,
        descricao: editingAction.descricao,
        responsavel: editingAction.responsavel,
        data: editingAction.data,
        assinatura: editingAction.assinatura,
      });
    } else {
      form.reset({
        accao: '',
        descricao: '',
        responsavel: '',
        data: format(new Date(), 'yyyy-MM-dd'),
        assinatura: '',
      });
    }
  }, [editingAction, form]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/acoes-imediatas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete action');
      }

      setActions(actions.filter((action) => action.id !== id));
      toast({
        title: 'Action deleted',
        description: 'The immediate action has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting action:', error);
      toast({
        title: 'Error',
        description:
          error.message || 'Failed to delete action. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (editingAction) {
        // Update existing action
        const response = await fetch(
          `/api/acoes-imediatas/${editingAction.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update action');
        }

        toast({
          title: 'Action updated',
          description: 'The immediate action has been successfully updated.',
        });
      } else {
        // Create new action
        const response = await fetch('/api/acoes-imediatas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to create action');
        }

        toast({
          title: 'Action created',
          description: 'The immediate action has been successfully created.',
        });
      }

      // Refresh the list
      fetchActions();

      // Close the form and reset
      setIsFormOpen(false);
      setEditingAction(null);
      form.reset();
    } catch (error) {
      console.error('Error saving action:', error);
      toast({
        title: 'Error',
        description: 'There was an error saving the action. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Filter actions based on search query
  const filteredActions = actions.filter(
    (action) =>
      action.accao.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.responsavel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='container mx-auto max-w-7xl px-4 py-6 space-y-8'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Acçoes Imediatas e Correctivas
          </h1>
          <p className='text-gray-500 mt-2'>
            Manage immediate and corrective actions
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingAction(null);
            setIsFormOpen(true);
          }}
          className='flex items-center gap-2 w-full sm:w-auto'
        >
          <Plus className='h-4 w-4' />
          Add Action
        </Button>
      </div>

      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search actions...'
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
              <span className='ml-2'>Loading actions...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[20%]'>Action</TableHead>
                  <TableHead className='w-[30%]'>Description</TableHead>
                  <TableHead className='w-[15%]'>Responsible</TableHead>
                  <TableHead className='w-[15%]'>Date</TableHead>
                  <TableHead className='w-[10%]'>Signature</TableHead>
                  <TableHead className='w-[10%] text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActions.length > 0 ? (
                  filteredActions.map((action) => (
                    <TableRow key={action.id}>
                      <TableCell className='font-medium'>
                        {action.accao}
                      </TableCell>
                      <TableCell>
                        <div className='line-clamp-2'>{action.descricao}</div>
                      </TableCell>
                      <TableCell>{action.responsavel}</TableCell>
                      <TableCell>
                        {new Date(action.data).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{action.assinatura}</TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                              setEditingAction(action);
                              setIsFormOpen(true);
                            }}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => action.id && setDeleteId(action.id)}
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
                      No actions found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Action Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>
              {editingAction
                ? 'Edit Immediate Action'
                : 'Create Immediate Action'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='accao'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter action' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='descricao'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter description'
                        className='min-h-[100px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='responsavel'
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
                  name='data'
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
                              field.onChange(
                                format(date || new Date(), 'yyyy-MM-dd')
                              )
                            }
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
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

              <FormField
                control={form.control}
                name='assinatura'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Signature</FormLabel>
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
                    setEditingAction(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type='submit'>
                  {editingAction ? 'Update' : 'Create'}
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
              immediate action.
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
