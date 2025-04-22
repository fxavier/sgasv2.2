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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  contactPerson: z.object({
    id: z.string().optional(),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    role: z.string().min(2, 'Role must be at least 2 characters'),
    contact: z.string().min(2, 'Contact must be at least 2 characters'),
    date: z.string(),
    signature: z.string().optional(),
  }),
});

export default function ResponsibleVerificationPage() {
  const [verifications, setVerifications] = useState<
    ResponsibleForVerification[]
  >([]);
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVerification, setEditingVerification] =
    useState<ResponsibleForVerification | null>(null);
  const [isCreatingContactPerson, setIsCreatingContactPerson] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactPerson: {
        name: '',
        role: '',
        contact: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        signature: '',
      },
    },
  });

  // Fetch responsible verifications and contact persons
  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch verifications
      const verificationResponse = await fetch(
        '/api/responsible-verifications'
      );
      if (!verificationResponse.ok) {
        throw new Error('Failed to fetch responsible verifications');
      }
      const verificationData = await verificationResponse.json();
      setVerifications(verificationData);

      // Fetch contact persons
      const contactPersonResponse = await fetch('/api/contact-persons');
      if (!contactPersonResponse.ok) {
        throw new Error('Failed to fetch contact persons');
      }
      const contactPersonData = await contactPersonResponse.json();
      setContactPersons(contactPersonData);
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

  useEffect(() => {
    fetchData();
  }, []);

  // Update form when editing a verification
  useEffect(() => {
    if (editingVerification) {
      form.reset({
        contactPerson: {
          id: editingVerification.contactPerson.id,
          name: editingVerification.contactPerson.name,
          role: editingVerification.contactPerson.role,
          contact: editingVerification.contactPerson.contact,
          date: editingVerification.contactPerson.date
            ? format(
                new Date(editingVerification.contactPerson.date),
                'yyyy-MM-dd'
              )
            : format(new Date(), 'yyyy-MM-dd'),
          signature: editingVerification.contactPerson.signature || '',
        },
      });
    } else {
      form.reset({
        contactPerson: {
          name: '',
          role: '',
          contact: '',
          date: format(new Date(), 'yyyy-MM-dd'),
          signature: '',
        },
      });
    }
  }, [editingVerification, form]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/responsible-verifications/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Failed to delete responsible verification'
        );
      }

      setVerifications(
        verifications.filter((verification) => verification.id !== id)
      );
      toast({
        title: 'Verification deleted',
        description:
          'The responsible verification has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting verification:', error);
      toast({
        title: 'Error',
        description:
          error.message ||
          'Failed to delete responsible verification. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isCreatingContactPerson) {
        // Create new contact person first
        const contactPersonResponse = await fetch('/api/contact-persons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values.contactPerson),
        });

        if (!contactPersonResponse.ok) {
          throw new Error('Failed to create contact person');
        }

        const contactPerson = await contactPersonResponse.json();

        // Now create the verification with the new contact person
        const verificationResponse = await fetch(
          '/api/responsible-verifications',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contactPersonId: contactPerson.id }),
          }
        );

        if (!verificationResponse.ok) {
          throw new Error('Failed to create responsible verification');
        }

        toast({
          title: 'Verification created',
          description:
            'The responsible verification has been successfully created.',
        });
      } else if (editingVerification) {
        // Update existing contact person
        const contactPersonResponse = await fetch(
          `/api/contact-persons/${editingVerification.contactPerson.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values.contactPerson),
          }
        );

        if (!contactPersonResponse.ok) {
          throw new Error('Failed to update contact person');
        }

        toast({
          title: 'Verification updated',
          description:
            'The responsible verification has been successfully updated.',
        });
      } else {
        // Use existing contact person
        const contactPersonId = values.contactPerson.id;

        if (!contactPersonId) {
          throw new Error('Contact person ID is required');
        }

        const verificationResponse = await fetch(
          '/api/responsible-verifications',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contactPersonId }),
          }
        );

        if (!verificationResponse.ok) {
          throw new Error('Failed to create responsible verification');
        }

        toast({
          title: 'Verification created',
          description:
            'The responsible verification has been successfully created.',
        });
      }

      // Refresh the list
      fetchData();

      // Close the form and reset
      setIsFormOpen(false);
      setEditingVerification(null);
      setIsCreatingContactPerson(false);
      form.reset();
    } catch (error) {
      console.error('Error saving verification:', error);
      toast({
        title: 'Error',
        description:
          'There was an error saving the responsible verification. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Filter verifications based on search query
  const filteredVerifications = verifications.filter(
    (verification) =>
      verification.contactPerson.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      verification.contactPerson.role
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      verification.contactPerson.contact
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className='container mx-auto max-w-7xl px-4 py-6 space-y-8'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Responsible for Verification
          </h1>
          <p className='text-gray-500 mt-2'>
            Manage persons responsible for verification
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingVerification(null);
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
                {filteredVerifications.length > 0 ? (
                  filteredVerifications.map((verification) => (
                    <TableRow key={verification.id}>
                      <TableCell className='font-medium'>
                        {verification.contactPerson.name}
                      </TableCell>
                      <TableCell>{verification.contactPerson.role}</TableCell>
                      <TableCell>
                        {verification.contactPerson.contact}
                      </TableCell>
                      <TableCell>
                        {new Date(
                          verification.contactPerson.date
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {verification.contactPerson.signature || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                              setEditingVerification(verification);
                              setIsFormOpen(true);
                            }}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setDeleteId(verification.id)}
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

      {/* Responsible Verification Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>
              {editingVerification
                ? 'Edit Responsible Person'
                : 'Add Responsible Person'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              {!editingVerification &&
                contactPersons.length > 0 &&
                !isCreatingContactPerson && (
                  <div className='space-y-4'>
                    <div className='flex justify-between items-center'>
                      <h3 className='text-sm font-medium'>
                        Select existing contact person
                      </h3>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => setIsCreatingContactPerson(true)}
                      >
                        Create New
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name='contactPerson.id'
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              const selectedPerson = contactPersons.find(
                                (p) => p.id === value
                              );
                              if (selectedPerson) {
                                form.setValue('contactPerson', {
                                  id: selectedPerson.id,
                                  name: selectedPerson.name,
                                  role: selectedPerson.role,
                                  contact: selectedPerson.contact,
                                  date: format(
                                    new Date(selectedPerson.date),
                                    'yyyy-MM-dd'
                                  ),
                                  signature: selectedPerson.signature || '',
                                });
                              }
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select contact person' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {contactPersons.map((person) => (
                                <SelectItem key={person.id} value={person.id!}>
                                  {person.name} - {person.role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

              {(isCreatingContactPerson ||
                editingVerification ||
                contactPersons.length === 0) && (
                <>
                  <FormField
                    control={form.control}
                    name='contactPerson.name'
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
                    name='contactPerson.role'
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
                    name='contactPerson.contact'
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
                    name='contactPerson.date'
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
                    name='contactPerson.signature'
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
                </>
              )}

              <div className='flex justify-end gap-4 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingVerification(null);
                    setIsCreatingContactPerson(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type='submit'>
                  {editingVerification ? 'Update' : 'Create'}
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
              responsible verification.
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
