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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Define the PessoaEnvolvida interface if not already defined
interface PessoaEnvolvida {
  id?: string;
  nome: string;
  departamento: Department;
  outrasInformacoes: string;
  created_at?: string;
  updated_at?: string;
}

const formSchema = z.object({
  nome: z.string().min(2, 'Name must be at least 2 characters'),
  departamento: z.object({
    id: z.string(),
    name: z.string(),
  }),
  outrasInformacoes: z
    .string()
    .min(5, 'Additional information must be at least 5 characters'),
});

export default function PessoaEnvolvidaPage() {
  const [people, setPeople] = useState<PessoaEnvolvida[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<PessoaEnvolvida | null>(
    null
  );
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      departamento: { id: '', name: '' },
      outrasInformacoes: '',
    },
  });

  // Fetch people and departments
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch departments
        const deptResponse = await fetch('/api/departments');
        if (deptResponse.ok) {
          const deptData = await deptResponse.json();
          setDepartments(deptData);
        } else {
          throw new Error('Failed to fetch departments');
        }

        // Fetch people
        const peopleResponse = await fetch('/api/pessoas-envolvidas');
        if (peopleResponse.ok) {
          const peopleData = await peopleResponse.json();
          setPeople(peopleData);
        } else {
          throw new Error('Failed to fetch people');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Update form when editing a person
  useEffect(() => {
    if (editingPerson) {
      form.reset({
        nome: editingPerson.nome,
        departamento: editingPerson.departamento,
        outrasInformacoes: editingPerson.outrasInformacoes,
      });
    } else {
      form.reset({
        nome: '',
        departamento: { id: '', name: '' },
        outrasInformacoes: '',
      });
    }
  }, [editingPerson, form]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/pessoas-envolvidas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete person');
      }

      setPeople(people.filter((person) => person.id !== id));
      toast({
        title: 'Person deleted',
        description: 'The person involved has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting person:', error);
      toast({
        title: 'Error',
        description:
          error.message || 'Failed to delete person. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (editingPerson) {
        // Update existing person
        const response = await fetch(
          `/api/pessoas-envolvidas/${editingPerson.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update person');
        }

        const updatedPerson = await response.json();
        setPeople(
          people.map((person) =>
            person.id === editingPerson.id ? updatedPerson : person
          )
        );

        toast({
          title: 'Person updated',
          description: 'The person involved has been successfully updated.',
        });
      } else {
        // Create new person
        const response = await fetch('/api/pessoas-envolvidas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to create person');
        }

        const newPerson = await response.json();
        setPeople([...people, newPerson]);

        toast({
          title: 'Person created',
          description: 'The person involved has been successfully created.',
        });
      }

      // Close the form and reset
      setIsFormOpen(false);
      setEditingPerson(null);
      form.reset();
    } catch (error) {
      console.error('Error saving person:', error);
      toast({
        title: 'Error',
        description: 'There was an error saving the person. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Filter people based on search query
  const filteredPeople = people.filter(
    (person) =>
      person.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.departamento.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      person.outrasInformacoes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='container mx-auto max-w-7xl px-4 py-6 space-y-8'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Pessoa Envolvida no Acidente
          </h1>
          <p className='text-gray-500 mt-2'>
            Manage people involved in accidents
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingPerson(null);
            setIsFormOpen(true);
          }}
          className='flex items-center gap-2 w-full sm:w-auto'
        >
          <Plus className='h-4 w-4' />
          Add Person
        </Button>
      </div>

      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search people...'
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
              <span className='ml-2'>Loading people...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[25%]'>Name</TableHead>
                  <TableHead className='w-[20%]'>Department</TableHead>
                  <TableHead className='w-[40%]'>
                    Additional Information
                  </TableHead>
                  <TableHead className='w-[15%] text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPeople.length > 0 ? (
                  filteredPeople.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell className='font-medium'>
                        {person.nome}
                      </TableCell>
                      <TableCell>{person.departamento.name}</TableCell>
                      <TableCell>
                        <div className='line-clamp-2'>
                          {person.outrasInformacoes}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                              setEditingPerson(person);
                              setIsFormOpen(true);
                            }}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => person.id && setDeleteId(person.id)}
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
                      colSpan={4}
                      className='text-center py-8 text-gray-500'
                    >
                      No people found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Person Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>
              {editingPerson ? 'Edit Person Involved' : 'Add Person Involved'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
                name='departamento'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const selected = departments.find(
                          (dept) => dept.id === value
                        );
                        if (selected) {
                          field.onChange(selected);
                        }
                      }}
                      value={field.value.id}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select department' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments
                          .filter((dept) => dept.id)
                          .map((dept) => (
                            <SelectItem key={dept.id} value={dept.id as string}>
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
                name='outrasInformacoes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter additional information'
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
                    setEditingPerson(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type='submit'>
                  {editingPerson ? 'Update' : 'Create'}
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
              person.
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
