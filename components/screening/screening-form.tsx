'use client';

import { useState, useEffect } from 'react';
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
import { ResponsiblePersonForm } from '@/components/responsible-person/responsible-person-form';

const formSchema = z.object({
  responsible_for_filling_form: z.object({
    id: z.string(),
    name: z.string(),
  }),
  responsible_for_verification: z.object({
    id: z.string(),
    name: z.string(),
  }),
  subproject: z.object({
    id: z.string(),
    name: z.string(),
  }),
  biodiversidade_recursos_naturais: z.object({
    id: z.string(),
    description: z.string(),
  }),
  response: z.enum(['SIM', 'NAO']),
  comment: z.string().optional(),
  relevant_standard: z.string().optional(),
  consultation_and_engagement: z.string().optional(),
  recomended_actions: z.string().optional(),
  screening_results: z.object({
    risk_category: z.enum(['ALTO', 'SUBSTANCIAL', 'MODERADO', 'BAIXO']),
    description: z.string(),
    instruments_to_be_developed: z.string(),
  }),
});

interface ScreeningFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  screening: EnvironmentalSocialScreening | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Create a SubprojectForm component for use within the ScreeningForm
function SubprojectForm({
  open,
  onOpenChange,
  subproject,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subproject: Subproject | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: subproject?.name || '',
      location: (subproject as any)?.location || '',
      type: (subproject as any)?.type || '',
      approximateArea: (subproject as any)?.approximateArea || '',
    },
  });

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      // This is a placeholder - would need proper API endpoint
      const response = await fetch('/api/subprojects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to create subproject');
      }

      toast({
        title: 'Subproject created',
        description: 'The subproject has been successfully created.',
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating subproject:', error);
      toast({
        title: 'Error',
        description: 'Failed to create subproject. Please try again.',
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
          <DialogTitle>
            {subproject ? 'Edit Subproject' : 'Create Subproject'}
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

            <FormField
              control={form.control}
              name='approximateArea'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Approximate Area</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter approximate area' {...field} />
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
                    {subproject ? 'Updating...' : 'Creating...'}
                  </>
                ) : subproject ? (
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

export function ScreeningForm({
  open,
  onOpenChange,
  screening,
  onClose,
  onSuccess,
}: ScreeningFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddResponsibleOpen, setIsAddResponsibleOpen] = useState(false);
  const [isAddVerifierOpen, setIsAddVerifierOpen] = useState(false);
  const [isAddSubprojectOpen, setIsAddSubprojectOpen] = useState(false);

  // State for dropdown data
  const [responsibles, setResponsibles] = useState<ResponsibleForFillingForm[]>(
    []
  );
  const [subprojects, setSubprojects] = useState<Subproject[]>([]);
  const [biodiversityResources, setBiodiversityResources] = useState<
    BiodeversidadeRecursosNaturais[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responsible_for_filling_form:
        screening?.responsible_for_filling_form || undefined,
      responsible_for_verification:
        screening?.responsible_for_verification || undefined,
      subproject: screening?.subproject || undefined,
      biodiversidade_recursos_naturais:
        screening?.biodiversidade_recursos_naturais || undefined,
      response: screening?.response || 'NAO',
      comment: screening?.comment || '',
      relevant_standard: screening?.relevant_standard || '',
      consultation_and_engagement: screening?.consultation_and_engagement || '',
      recomended_actions: screening?.recomended_actions || '',
      screening_results: screening?.screening_results || {
        risk_category: 'BAIXO',
        description: '',
        instruments_to_be_developed: '',
      },
    },
  });

  // Fetch all necessary data when the form opens
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // Fetch responsible persons
          const respResponse = await fetch('/api/responsible-persons');
          if (respResponse.ok) {
            const respData = await respResponse.json();
            setResponsibles(respData);
          }

          // Fetch subprojects
          const subprojResponse = await fetch('/api/subprojects');
          if (subprojResponse.ok) {
            const subprojData = await subprojResponse.json();
            setSubprojects(subprojData);
          }

          // Fetch biodiversity resources
          const bioResponse = await fetch('/api/biodiversity-resources');
          if (bioResponse.ok) {
            const bioData = await bioResponse.json();
            setBiodiversityResources(bioData);
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

  // Update form when screening changes
  useEffect(() => {
    if (screening) {
      form.reset({
        responsible_for_filling_form: screening.responsible_for_filling_form,
        responsible_for_verification: screening.responsible_for_verification,
        subproject: screening.subproject,
        biodiversidade_recursos_naturais:
          screening.biodiversidade_recursos_naturais,
        response: screening.response,
        comment: screening.comment,
        relevant_standard: screening.relevant_standard,
        consultation_and_engagement: screening.consultation_and_engagement,
        recomended_actions: screening.recomended_actions,
        screening_results: screening.screening_results,
      });
    }
  }, [screening, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (screening) {
        // Update existing screening
        const response = await fetch(`/api/screening-forms/${screening.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to update screening form');
        }

        toast({
          title: 'Screening updated',
          description: 'The screening form has been successfully updated.',
        });
      } else {
        // Create new screening
        const response = await fetch('/api/screening-forms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to create screening form');
        }

        toast({
          title: 'Screening created',
          description: 'The screening form has been successfully created.',
        });
      }

      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving screening form:', error);
      toast({
        title: 'Error',
        description:
          'There was an error saving the screening form. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle successful creation of a responsible person
  const handleResponsibleSuccess = async () => {
    try {
      // Fetch responsible persons again to update dropdown list
      const respResponse = await fetch('/api/responsible-persons');
      if (respResponse.ok) {
        const respData = await respResponse.json();
        setResponsibles(respData);
      }
      toast({
        title: 'Responsible Person Added',
        description: 'New responsible person has been successfully added.',
      });
    } catch (error) {
      console.error('Error refreshing responsible persons:', error);
    }
  };

  // Handle successful creation of a subproject
  const handleSubprojectSuccess = async () => {
    try {
      // Fetch subprojects again to update dropdown list
      const subprojResponse = await fetch('/api/subprojects');
      if (subprojResponse.ok) {
        const subprojData = await subprojResponse.json();
        setSubprojects(subprojData);
      }
      toast({
        title: 'Subproject Added',
        description: 'New subproject has been successfully added.',
      });
    } catch (error) {
      console.error('Error refreshing subprojects:', error);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {screening ? 'Edit Screening Form' : 'Create Screening Form'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='responsible_for_filling_form'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsible for Filling</FormLabel>
                    <div className='flex gap-2'>
                      <Select
                        onValueChange={(value) => {
                          const selected = responsibles.find(
                            (resp) => resp.id === value
                          );
                          field.onChange(selected);
                        }}
                        value={field.value?.id}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select responsible' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {responsibles.map((resp) => (
                            <SelectItem key={resp.id} value={resp.id}>
                              {resp.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() => setIsAddResponsibleOpen(true)}
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
                name='responsible_for_verification'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsible for Verification</FormLabel>
                    <div className='flex gap-2'>
                      <Select
                        onValueChange={(value) => {
                          const selected = responsibles.find(
                            (resp) => resp.id === value
                          );
                          field.onChange(selected);
                        }}
                        value={field.value?.id}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select responsible' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {responsibles.map((resp) => (
                            <SelectItem key={resp.id} value={resp.id}>
                              {resp.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() => setIsAddVerifierOpen(true)}
                      >
                        <Plus className='h-4 w-4' />
                      </Button>
                    </div>
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
                  <div className='flex gap-2'>
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
                    <Button
                      type='button'
                      variant='outline'
                      size='icon'
                      onClick={() => setIsAddSubprojectOpen(true)}
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
              name='biodiversidade_recursos_naturais'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biodiversidade e Recursos Naturais</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const selected = biodiversityResources.find(
                        (bio) => bio.id === value
                      );
                      field.onChange(selected);
                    }}
                    value={field.value?.id}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select biodiversidade' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {biodiversityResources.map((bio) => (
                        <SelectItem key={bio.id} value={bio.id}>
                          {bio.description}
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
              name='response'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Response</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select response' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='SIM'>Sim</SelectItem>
                      <SelectItem value='NAO'>Não</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='comment'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Add a comment'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='relevant_standard'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relevant Standard</FormLabel>
                  <FormControl>
                    <Input placeholder='Relevant standard' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='consultation_and_engagement'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consultation and Engagement</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Consultation and engagement details'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='recomended_actions'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recommended Actions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Recommended actions'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Screening Results</h3>

              <FormField
                control={form.control}
                name='screening_results.risk_category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select risk category' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='ALTO'>Alto Risco</SelectItem>
                        <SelectItem value='SUBSTANCIAL'>
                          Risco Substancial
                        </SelectItem>
                        <SelectItem value='MODERADO'>Risco Moderado</SelectItem>
                        <SelectItem value='BAIXO'>Risco Baixo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='screening_results.description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Screening results description'
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='screening_results.instruments_to_be_developed'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instruments to be Developed</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Instruments to be developed'
                        className='resize-none'
                        {...field}
                      />
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
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    {screening ? 'Updating...' : 'Creating...'}
                  </>
                ) : screening ? (
                  'Update'
                ) : (
                  'Create'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>

      {/* Responsible Person Forms */}
      <ResponsiblePersonForm
        open={isAddResponsibleOpen}
        onOpenChange={setIsAddResponsibleOpen}
        person={null}
        onClose={() => setIsAddResponsibleOpen(false)}
        onSuccess={handleResponsibleSuccess}
      />

      <ResponsiblePersonForm
        open={isAddVerifierOpen}
        onOpenChange={setIsAddVerifierOpen}
        person={null}
        onClose={() => setIsAddVerifierOpen(false)}
        onSuccess={handleResponsibleSuccess}
      />

      {/* Subproject Form */}
      <SubprojectForm
        open={isAddSubprojectOpen}
        onOpenChange={setIsAddSubprojectOpen}
        subproject={null}
        onClose={() => setIsAddSubprojectOpen(false)}
        onSuccess={handleSubprojectSuccess}
      />
    </Dialog>
  );
}
