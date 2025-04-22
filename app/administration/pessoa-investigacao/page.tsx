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

// Define the PessoasEnvolvidasNaInvestigacao interface if not already defined
interface PessoasEnvolvidasNaInvestigacao {
  id?: string;
  nome: string;
  empresa: string;
  actividade: string;
  assinatura: string;
  data: string;
  created_at?: string;
  updated_at?: string;
}

const formSchema = z.object({
  nome: z.string().min(2, 'Name must be at least 2 characters'),
  empresa: z.string().min(2, 'Company must be at least 2 characters'),
  actividade: z.string().min(2, 'Activity must be at least 2 characters'),
  assinatura: z.string().min(2, 'Signature must be at least 2 characters'),
  data: z.string(),
});

export default function PessoaInvestigacaoPage() {
  const [investigators, setInvestigators] = useState<
    PessoasEnvolvidasNaInvestigacao[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvestigator, setEditingInvestigator] =
    useState<PessoasEnvolvidasNaInvestigacao | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      empresa: '',
      actividade: '',
      assinatura: '',
      data: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  // Fetch investigators
  const fetchInvestigators = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/pessoas-investigacao');
      if (!response.ok) {
        throw new Error('Failed to fetch investigators');
      }
      const data = await response.json();
      setInvestigators(data);
    } catch (error) {
      console.error('Error fetching investigators:', error);
      toast({
        title: 'Error',
        description: 'Failed to load investigators. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestigators();
  }, []);

  // Update form when editing an investigator
  useEffect(() => {
    if (editingInvestigator) {
      form.reset({
        nome: editingInvestigator.nome,
        empresa: editingInvestigator.empresa,
        actividade: editingInvestigator.actividade,
        assinatura: editingInvestigator.assinatura,
        data: editingInvestigator.data,
      });
    } else {
      form.reset({
        nome: '',
        empresa: '',
        actividade: '',
        assinatura: '',
        data: format(new Date(), 'yyyy-MM-dd'),
      });
    }
  }, [editingInvestigator, form]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/pessoas-investigacao/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete investigator');
      }

      setInvestigators(
        investigators.filter((investigator) => investigator.id !== id)
      );
      toast({
        title: 'Investigator deleted',
        description: 'The investigator has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting investigator:', error);
      toast({
        title: 'Error',
        description:
          error.message || 'Failed to delete investigator. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (editingInvestigator) {
        // Update existing investigator
        const response = await fetch(
          `/api/pessoas-investigacao/${editingInvestigator.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update investigator');
        }

        toast({
          title: 'Investigator updated',
          description: 'The investigator has been successfully updated.',
        });
      } else {
        // Create new investigator
        const response = await fetch('/api/pessoas-investigacao', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to create investigator');
        }

        toast({
          title: 'Investigator created',
          description: 'The investigator has been successfully created.',
        });
      }

      // Refresh the list
      fetchInvestigators();

      // Close the form and reset
      setIsFormOpen(false);
      setEditingInvestigator(null);
      form.reset();
    } catch (error) {
      console.error('Error saving investigator:', error);
      toast({
        title: 'Error',
        description:
          'There was an error saving the investigator. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Filter investigators based on search query
  const filteredInvestigators = investigators.filter(
    (investigator) =>
      investigator.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investigator.empresa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investigator.actividade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='container mx-auto max-w-7xl px-4 py-6 space-y-8'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Pessoa Envolvida na Investigação
          </h1>
          <p className='text-gray-500 mt-2'>
            Manage people involved in investigations
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingInvestigator(null);
            setIsFormOpen(true);
          }}
          className='flex items-center gap-2 w-full sm:w-auto'
        >
          <Plus className='h-4 w-4' />
          Add Investigator
        </Button>
      </div>

      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search investigators...'
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
              <span className='ml-2'>Loading investigators...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[20%]'>Name</TableHead>
                  <TableHead className='w-[20%]'>Company</TableHead>
                  <TableHead className='w-[20%]'>Activity</TableHead>
                  <TableHead className='w-[15%]'>Date</TableHead>
                  <TableHead className='w-[10%]'>Signature</TableHead>
                  <TableHead className='w-[15%] text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvestigators.length > 0 ? (
                  filteredInvestigators.map((investigator) => (
                    <TableRow key={investigator.id}>
                      <TableCell className='font-medium'>
                        {investigator.nome}
                      </TableCell>
                      <TableCell>{investigator.empresa}</TableCell>
                      <TableCell>{investigator.actividade}</TableCell>
                      <TableCell>
                        {new Date(investigator.data).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{investigator.assinatura}</TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                              setEditingInvestigator(investigator);
                              setIsFormOpen(true);
                            }}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setDeleteId(investigator.id || null)}
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
                      No investigators found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Investigator Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>
              {editingInvestigator ? 'Edit Investigator' : 'Add Investigator'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='nome'
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
                  name='empresa'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter company' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='actividade'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter activity' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
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
              </div>

              <div className='flex justify-end gap-4 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingInvestigator(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type='submit'>
                  {editingInvestigator ? 'Update' : 'Create'}
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
              investigator.
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
