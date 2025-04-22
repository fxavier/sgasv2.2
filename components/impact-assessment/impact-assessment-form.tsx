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
import { Calendar as CalendarIcon, Plus, Loader2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { DepartmentForm } from '@/components/departments/department-form';
import { LegalRequirementForm } from '@/components/legal-requirements/legal-requirement-form';

const subprojectFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  type: z.string().min(2, 'Type must be at least 2 characters'),
  approximateArea: z
    .string()
    .min(2, 'Approximate area must be at least 2 characters'),
});

const formSchema = z.object({
  departament: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
  subproject: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
  activity: z.string().min(2, 'Activity must be at least 2 characters'),
  risks_and_impact: z.object({
    id: z.string(),
    description: z.string(),
  }),
  environmental_factor: z.object({
    id: z.string(),
    description: z.string(),
  }),
  life_cycle: z.enum([
    'PRE_CONSTRUCAO',
    'CONSTRUCAO',
    'OPERACAO',
    'DESATIVACAO',
    'ENCERRAMENTO',
    'REINTEGRACAO_RESTAURACAO',
  ]),
  statute: z.enum(['POSITIVO', 'NEGATIVO']),
  extension: z.enum(['LOCAL', 'REGIONAL', 'NACIONAL', 'GLOBAL']),
  duration: z.enum(['CURTO_PRAZO', 'MEDIO_PRAZO', 'LONGO_PRAZO']),
  intensity: z.enum(['BAIXA', 'MEDIA', 'ALTA']),
  probability: z.enum([
    'IMPROVAVEL',
    'PROVAVEL',
    'ALTAMENTE_PROVAVEL',
    'DEFINITIVA',
  ]),
  significance: z.string().optional(),
  description_of_measures: z
    .string()
    .min(10, 'Description must be at least 10 characters'),
  deadline: z.string(),
  responsible: z.string().optional(),
  effectiveness_assessment: z.string(),
  legal_requirements: z
    .array(
      z.object({
        id: z.string(),
        number: z.string(),
        document_title: z.string(),
      })
    )
    .optional(),
  compliance_requirements: z.string(),
  observations: z.string().optional(),
});

function SubprojectDialog({
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

  const form = useForm<z.infer<typeof subprojectFormSchema>>({
    resolver: zodResolver(subprojectFormSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      type: '',
      approximateArea: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof subprojectFormSchema>) => {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/subprojects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          location: values.location,
          type: values.type,
          approximateArea: values.approximateArea,
          contractorName: values.description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subproject');
      }

      toast({
        title: 'Subproject created',
        description: 'The subproject has been successfully created.',
      });

      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating subproject:', error);
      toast({
        title: 'Error',
        description: 'There was an error creating the subproject.',
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
          <DialogTitle>Create Subproject</DialogTitle>
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
                    <Input placeholder='Subproject name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Subproject description'
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
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder='Subproject location' {...field} />
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
                    <Input placeholder='Subproject type' {...field} />
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
                    <Input placeholder='Approximate area' {...field} />
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

const calculateSignificance = (
  intensity: string,
  probability: string
): string => {
  if (intensity === 'BAIXA') {
    if (probability === 'IMPROVAVEL' || probability === 'PROVAVEL') {
      return 'Pouco Significativo';
    } else if (probability === 'ALTAMENTE_PROVAVEL') {
      return 'Significativo';
    }
  } else if (intensity === 'MEDIA') {
    if (probability === 'IMPROVAVEL') {
      return 'Pouco Significativo';
    } else if (
      probability === 'PROVAVEL' ||
      probability === 'ALTAMENTE_PROVAVEL'
    ) {
      return 'Significativo';
    } else if (probability === 'DEFINITIVA') {
      return 'Muito Significativo';
    }
  } else if (intensity === 'ALTA') {
    if (probability === 'IMPROVAVEL' || probability === 'PROVAVEL') {
      return 'Significativo';
    } else if (
      probability === 'ALTAMENTE_PROVAVEL' ||
      probability === 'DEFINITIVA'
    ) {
      return 'Muito Significativo';
    }
  }
  return '';
};

interface ImpactAssessmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessment: ImpactAssessment | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ImpactAssessmentForm({
  open,
  onOpenChange,
  assessment,
  onClose,
  onSuccess,
}: ImpactAssessmentFormProps) {
  const { toast } = useToast();
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [isAddSubprojectOpen, setIsAddSubprojectOpen] = useState(false);
  const [isAddLegalRequirementOpen, setIsAddLegalRequirementOpen] =
    useState(false);
  const [significance, setSignificance] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for dropdown data
  const [departments, setDepartments] = useState<Department[]>([]);
  const [subprojects, setSubprojects] = useState<Subproject[]>([]);
  const [risksAndImpacts, setRisksAndImpacts] = useState<RisksAndImpact[]>([]);
  const [environmentalFactors, setEnvironmentalFactors] = useState<
    EnvironmentalFactor[]
  >([]);
  const [legalRequirements, setLegalRequirements] = useState<
    LegalRequirement[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departament: assessment?.departament || undefined,
      subproject: assessment?.subproject || undefined,
      activity: assessment?.activity || '',
      risks_and_impact: assessment?.risks_and_impact || undefined,
      environmental_factor: assessment?.environmental_factor || undefined,
      life_cycle: assessment?.life_cycle || 'PRE_CONSTRUCAO',
      statute: assessment?.statute || 'POSITIVO',
      extension: assessment?.extension || 'LOCAL',
      duration: assessment?.duration || 'CURTO_PRAZO',
      intensity: assessment?.intensity || 'BAIXA',
      probability: assessment?.probability || 'IMPROVAVEL',
      description_of_measures: assessment?.description_of_measures || '',
      deadline: assessment?.deadline || format(new Date(), 'yyyy-MM-dd'),
      responsible: assessment?.responsible || '',
      effectiveness_assessment: assessment?.effectiveness_assessment || '',
      legal_requirements: assessment?.legal_requirements || [],
      compliance_requirements: assessment?.compliance_requirements || '',
      observations: assessment?.observations || '',
    },
  });

  // Fetch all necessary data when the form opens
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // Fetch departments
          const deptResponse = await fetch('/api/departments');
          if (deptResponse.ok) {
            const deptData = await deptResponse.json();
            setDepartments(deptData);
          }

          // Fetch subprojects
          const subprojResponse = await fetch('/api/subprojects');
          if (subprojResponse.ok) {
            const subprojData = await subprojResponse.json();
            setSubprojects(subprojData);
          }

          // Fetch risks and impacts
          const risksResponse = await fetch('/api/risks-and-impacts');
          if (risksResponse.ok) {
            const risksData = await risksResponse.json();
            setRisksAndImpacts(risksData);
          }

          // Fetch environmental factors
          const factorsResponse = await fetch('/api/environmental-factors');
          if (factorsResponse.ok) {
            const factorsData = await factorsResponse.json();
            setEnvironmentalFactors(factorsData);
          }

          // Fetch legal requirements
          const legalResponse = await fetch('/api/legal-requirements');
          if (legalResponse.ok) {
            const legalData = await legalResponse.json();
            setLegalRequirements(legalData);
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

  // Update form when assessment changes
  useEffect(() => {
    if (assessment) {
      form.reset({
        departament: assessment.departament,
        subproject: assessment.subproject,
        activity: assessment.activity,
        risks_and_impact: assessment.risks_and_impact,
        environmental_factor: assessment.environmental_factor,
        life_cycle: assessment.life_cycle,
        statute: assessment.statute,
        extension: assessment.extension,
        duration: assessment.duration,
        intensity: assessment.intensity,
        probability: assessment.probability,
        significance: assessment.significance,
        description_of_measures: assessment.description_of_measures,
        deadline: assessment.deadline,
        responsible: assessment.responsible,
        effectiveness_assessment: assessment.effectiveness_assessment,
        legal_requirements: assessment.legal_requirements,
        compliance_requirements: assessment.compliance_requirements,
        observations: assessment.observations,
      });

      if (assessment.significance) {
        setSignificance(assessment.significance);
      }
    }
  }, [assessment, form]);

  const intensity = form.watch('intensity');
  const probability = form.watch('probability');

  useEffect(() => {
    if (intensity && probability) {
      const newSignificance = calculateSignificance(intensity, probability);
      setSignificance(newSignificance);
      form.setValue('significance', newSignificance);
    }
  }, [intensity, probability, form]);

  const handleDepartmentSuccess = async () => {
    try {
      const response = await fetch('/api/departments');
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleSubprojectSuccess = async () => {
    try {
      const response = await fetch('/api/subprojects');
      if (response.ok) {
        const data = await response.json();
        setSubprojects(data);
      }
    } catch (error) {
      console.error('Error fetching subprojects:', error);
    }
  };

  const handleLegalRequirementSuccess = async () => {
    try {
      const response = await fetch('/api/risks/legal-requirements');
      if (response.ok) {
        const data = await response.json();
        setLegalRequirements(data);
      }
    } catch (error) {
      console.error('Error fetching legal requirements:', error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const submissionValues = {
        ...values,
        significance,
      };

      if (assessment) {
        // Update existing assessment
        const response = await fetch(
          `/api/risks/impact-assessments/${assessment.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionValues),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update impact assessment');
        }

        toast({
          title: 'Assessment updated',
          description: 'The impact assessment has been successfully updated.',
        });
      } else {
        // Create new assessment
        const response = await fetch('/api/risks/impact-assessments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionValues),
        });

        if (!response.ok) {
          throw new Error('Failed to create impact assessment');
        }

        toast({
          title: 'Assessment created',
          description: 'The impact assessment has been successfully created.',
        });
      }

      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving impact assessment:', error);
      toast({
        title: 'Error',
        description:
          'There was an error saving the impact assessment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[800px]'>
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
        <DialogContent className='sm:max-w-[800px] max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              {assessment
                ? 'Edit Impact Assessment'
                : 'Create Impact Assessment'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='departament'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Department</FormLabel>
                      <div className='flex gap-2'>
                        <Select
                          onValueChange={(value) => {
                            const selected = departments.find(
                              (dept) => dept.id === value
                            );
                            field.onChange(selected);
                          }}
                          value={field.value?.id}
                        >
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Select department' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments
                              .filter((dept) => dept.id)
                              .map((dept) => (
                                <SelectItem
                                  key={dept.id}
                                  value={dept.id as string}
                                >
                                  {dept.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type='button'
                          variant='outline'
                          size='icon'
                          onClick={() => setIsAddDepartmentOpen(true)}
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
                  name='subproject'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
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
                            <SelectTrigger className='w-full'>
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
              </div>

              <FormField
                control={form.control}
                name='legal_requirements'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Legal Requirements</FormLabel>
                    <div className='flex gap-2'>
                      <Select
                        onValueChange={(value) => {
                          const selected = legalRequirements.find(
                            (req) => req.id === value
                          );
                          field.onChange(selected ? [selected] : []);
                        }}
                        value={field.value?.[0]?.id}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select legal requirements' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {legalRequirements
                            .filter((req) => req.id)
                            .map((req) => (
                              <SelectItem key={req.id} value={req.id as string}>
                                {req.number} - {req.document_title}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() => setIsAddLegalRequirementOpen(true)}
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
                name='activity'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity</FormLabel>
                    <FormControl>
                      <Input placeholder='Activity name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='risks_and_impact'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risks and Impact</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const selected = risksAndImpacts.find(
                            (item) => item.id === value
                          );
                          field.onChange(selected);
                        }}
                        value={field.value?.id}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select risks and impact' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {risksAndImpacts.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.description}
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
                  name='environmental_factor'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Environmental Factor</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const selected = environmentalFactors.find(
                            (item) => item.id === value
                          );
                          field.onChange(selected);
                        }}
                        value={field.value?.id}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select environmental factor' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {environmentalFactors.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='life_cycle'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Life Cycle</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select life cycle' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='PRE_CONSTRUCAO'>
                            Pré-Construção
                          </SelectItem>
                          <SelectItem value='CONSTRUCAO'>Construção</SelectItem>
                          <SelectItem value='OPERACAO'>Operação</SelectItem>
                          <SelectItem value='DESATIVACAO'>
                            Desativação
                          </SelectItem>
                          <SelectItem value='ENCERRAMENTO'>
                            Encerramento
                          </SelectItem>
                          <SelectItem value='REINTEGRACAO_RESTAURACAO'>
                            Reintegração/Restauração
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='statute'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statute</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select statute' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='POSITIVO'>Positivo</SelectItem>
                          <SelectItem value='NEGATIVO'>Negativo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='extension'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Extension</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select extension' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='LOCAL'>Local</SelectItem>
                          <SelectItem value='REGIONAL'>Regional</SelectItem>
                          <SelectItem value='NACIONAL'>Nacional</SelectItem>
                          <SelectItem value='GLOBAL'>Global</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='duration'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select duration' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='CURTO_PRAZO'>
                            Curto Prazo
                          </SelectItem>
                          <SelectItem value='MEDIO_PRAZO'>
                            Médio Prazo
                          </SelectItem>
                          <SelectItem value='LONGO_PRAZO'>
                            Longo Prazo
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='intensity'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intensity</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select intensity' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='BAIXA'>Baixa</SelectItem>
                          <SelectItem value='MEDIA'>Média</SelectItem>
                          <SelectItem value='ALTA'>Alta</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='probability'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Probability</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select probability' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='IMPROVAVEL'>Improvável</SelectItem>
                          <SelectItem value='PROVAVEL'>Provável</SelectItem>
                          <SelectItem value='ALTAMENTE_PROVAVEL'>
                            Altamente Provável
                          </SelectItem>
                          <SelectItem value='DEFINITIVA'>Definitiva</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='significance'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Significance</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={significance}
                          disabled
                          className='bg-gray-100'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='description_of_measures'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description of Measures</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Describe the measures'
                        className='resize-none'
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
                  name='deadline'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Deadline</FormLabel>
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
                  name='responsible'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsible</FormLabel>
                      <FormControl>
                        <Input placeholder='Responsible person' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='effectiveness_assessment'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Effectiveness Assessment</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select effectiveness' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='EFFECTIVE'>Effective</SelectItem>
                        <SelectItem value='NOT_EFFECTIVE'>
                          Not Effective
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='compliance_requirements'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compliance Requirements</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Compliance requirements'
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
                name='observations'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observations</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Additional observations'
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
                      {assessment ? 'Updating...' : 'Creating...'}
                    </>
                  ) : assessment ? (
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

      <DepartmentForm
        open={isAddDepartmentOpen}
        onOpenChange={setIsAddDepartmentOpen}
        department={null}
        onClose={() => setIsAddDepartmentOpen(false)}
        onSuccess={handleDepartmentSuccess}
      />

      <SubprojectDialog
        open={isAddSubprojectOpen}
        onOpenChange={setIsAddSubprojectOpen}
        onClose={() => setIsAddSubprojectOpen(false)}
        onSuccess={handleSubprojectSuccess}
      />

      <LegalRequirementForm
        open={isAddLegalRequirementOpen}
        onOpenChange={setIsAddLegalRequirementOpen}
        requirement={null}
        onClose={() => setIsAddLegalRequirementOpen(false)}
        onSuccess={handleLegalRequirementSuccess}
      />
    </>
  );
}
