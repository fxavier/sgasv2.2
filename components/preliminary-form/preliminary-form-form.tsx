'use client';

import { useState, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
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
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  activity_name: z.string().min(1, 'Activity name is required'),
  activity_type: z.enum([
    'TURISTICA',
    'INDUSTRIAL',
    'AGRO_PECUARIA',
    'ENERGETICA',
    'SERVICOS',
    'OUTRA',
  ]),
  other_activity_type: z.string().optional(),
  development_stage: z.enum(['NOVA', 'REABILITACAO', 'EXPANSAO', 'OUTRO']),
  other_development_stage: z.string().optional(),
  proponents: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  telephone: z.string().optional(),
  fax: z.string().optional(),
  mobile_phone: z.string().optional(),
  email: z.string().email('Invalid email address'),
  activity_location: z.string().min(1, 'Activity location is required'),
  activity_city: z.string().min(1, 'City is required'),
  activity_locality: z.string().optional(),
  activity_district: z.string().optional(),
  activity_province: z.enum([
    'MAPUTO',
    'MAPUTO_CITY',
    'GAZA',
    'INHAMBANE',
    'SOFALA',
    'MANICA',
    'TETE',
    'ZAMBEZIA',
    'NAMPULA',
    'CABO_DELGADO',
    'NIASSA',
  ]),
  geographic_coordinates: z.string().optional(),
  insertion_point: z.enum(['RURAL', 'URBANO', 'PERIURBANO']),
  territorial_planning_framework: z.enum([
    'ESPACO_HABITACIONAL',
    'INDUSTRIAL',
    'SERVICOS',
    'OUTRO',
  ]),
  activity_infrastructure: z.string().optional(),
  associated_activities: z.string().optional(),
  construction_operation_technology_description: z.string().optional(),
  main_complementary_activities: z.string().optional(),
  labor_type_quantity_origin: z.string().optional(),
  raw_materials_type_quantity_origin_and_provenance: z.string().optional(),
  chemicals_used: z.string().optional(),
  type_origin_water_energy_consumption: z.string().optional(),
  fuels_lubricants_origin: z.string().optional(),
  other_resources_needed: z.string().optional(),
  land_ownership: z.string().optional(),
  activity_location_alternatives: z.string().optional(),
  brief_description_on_local_regional_ref_env_situation: z.string().optional(),
  physical_characteristics_of_activity_site: z
    .enum(['PLANICIE', 'PLANALTO', 'VALE', 'MONTANHA'])
    .optional(),
  predominant_ecosystems: z
    .enum(['FLUVIAL', 'LACUSTRE', 'MARINHO', 'TERRESTRE'])
    .optional(),
  location_zone: z.enum(['COSTEIRA', 'INTERIOR', 'ILHA']).optional(),
  type_predominant_vegetation: z
    .enum(['FLORESTA', 'SAVANA', 'OUTRO'])
    .optional(),
  land_use: z
    .enum(['AGROPECUARIO', 'HABITACIONAL', 'INDUSTRIAL', 'PROTECCAO', 'OUTRO'])
    .optional(),
  existing_infrastructure_around_activity_area: z.string().optional(),
  total_investment_value: z.number().optional(),
});

type PreliminaryFormFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: PreliminaryEnvironmentalForm | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function PreliminaryFormForm({
  open,
  onOpenChange,
  form,
  onClose,
  onSuccess,
}: PreliminaryFormFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activity_name: form?.activity_name || '',
      activity_type: form?.activity_type || 'TURISTICA',
      other_activity_type: form?.other_activity_type || '',
      development_stage: form?.development_stage || 'NOVA',
      other_development_stage: form?.other_development_stage || '',
      proponents: form?.proponents || '',
      address: form?.address || '',
      telephone: form?.telephone || '',
      fax: form?.fax || '',
      mobile_phone: form?.mobile_phone || '',
      email: form?.email || '',
      activity_location: form?.activity_location || '',
      activity_city: form?.activity_city || '',
      activity_locality: form?.activity_locality || '',
      activity_district: form?.activity_district || '',
      activity_province: form?.activity_province || 'MAPUTO',
      geographic_coordinates: form?.geographic_coordinates || '',
      insertion_point: form?.insertion_point || 'RURAL',
      territorial_planning_framework:
        form?.territorial_planning_framework || 'ESPACO_HABITACIONAL',
      activity_infrastructure: form?.activity_infrastructure || '',
      associated_activities: form?.associated_activities || '',
      construction_operation_technology_description:
        form?.construction_operation_technology_description || '',
      main_complementary_activities: form?.main_complementary_activities || '',
      labor_type_quantity_origin: form?.labor_type_quantity_origin || '',
      raw_materials_type_quantity_origin_and_provenance:
        form?.raw_materials_type_quantity_origin_and_provenance || '',
      chemicals_used: form?.chemicals_used || '',
      type_origin_water_energy_consumption:
        form?.type_origin_water_energy_consumption || '',
      fuels_lubricants_origin: form?.fuels_lubricants_origin || '',
      other_resources_needed: form?.other_resources_needed || '',
      land_ownership: form?.land_ownership || '',
      activity_location_alternatives:
        form?.activity_location_alternatives || '',
      brief_description_on_local_regional_ref_env_situation:
        form?.brief_description_on_local_regional_ref_env_situation || '',
      physical_characteristics_of_activity_site:
        form?.physical_characteristics_of_activity_site || undefined,
      predominant_ecosystems: form?.predominant_ecosystems || undefined,
      location_zone: form?.location_zone || undefined,
      type_predominant_vegetation:
        form?.type_predominant_vegetation || undefined,
      land_use: form?.land_use || undefined,
      existing_infrastructure_around_activity_area:
        form?.existing_infrastructure_around_activity_area || '',
      total_investment_value: form?.total_investment_value || undefined,
    },
  });

  // Update form when form data changes
  useEffect(() => {
    if (form) {
      formMethods.reset({
        activity_name: form.activity_name,
        activity_type: form.activity_type,
        other_activity_type: form.other_activity_type,
        development_stage: form.development_stage,
        other_development_stage: form.other_development_stage,
        proponents: form.proponents,
        address: form.address,
        telephone: form.telephone,
        fax: form.fax,
        mobile_phone: form.mobile_phone,
        email: form.email,
        activity_location: form.activity_location,
        activity_city: form.activity_city,
        activity_locality: form.activity_locality,
        activity_district: form.activity_district,
        activity_province: form.activity_province,
        geographic_coordinates: form.geographic_coordinates,
        insertion_point: form.insertion_point,
        territorial_planning_framework: form.territorial_planning_framework,
        activity_infrastructure: form.activity_infrastructure,
        associated_activities: form.associated_activities,
        construction_operation_technology_description:
          form.construction_operation_technology_description,
        main_complementary_activities: form.main_complementary_activities,
        labor_type_quantity_origin: form.labor_type_quantity_origin,
        raw_materials_type_quantity_origin_and_provenance:
          form.raw_materials_type_quantity_origin_and_provenance,
        chemicals_used: form.chemicals_used,
        type_origin_water_energy_consumption:
          form.type_origin_water_energy_consumption,
        fuels_lubricants_origin: form.fuels_lubricants_origin,
        other_resources_needed: form.other_resources_needed,
        land_ownership: form.land_ownership,
        activity_location_alternatives: form.activity_location_alternatives,
        brief_description_on_local_regional_ref_env_situation:
          form.brief_description_on_local_regional_ref_env_situation,
        physical_characteristics_of_activity_site:
          form.physical_characteristics_of_activity_site,
        predominant_ecosystems: form.predominant_ecosystems,
        location_zone: form.location_zone,
        type_predominant_vegetation: form.type_predominant_vegetation,
        land_use: form.land_use,
        existing_infrastructure_around_activity_area:
          form.existing_infrastructure_around_activity_area,
        total_investment_value: form.total_investment_value,
      });
    }
  }, [form, formMethods]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      if (form) {
        // Update existing form
        const response = await fetch(`/api/preliminary-forms/${form.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to update preliminary form');
        }

        toast({
          title: 'Form updated',
          description:
            'The preliminary environmental form has been successfully updated.',
        });
      } else {
        // Create new form
        const response = await fetch('/api/preliminary-forms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to create preliminary form');
        }

        toast({
          title: 'Form created',
          description:
            'The preliminary environmental form has been successfully created.',
        });
      }

      formMethods.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: 'There was an error saving the form. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[800px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {form
              ? 'Edit Preliminary Environmental Form'
              : 'New Preliminary Environmental Form'}
          </DialogTitle>
        </DialogHeader>
        <Form {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={formMethods.control}
                name='activity_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter activity name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formMethods.control}
                name='activity_type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select activity type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='TURISTICA'>Turística</SelectItem>
                        <SelectItem value='INDUSTRIAL'>Industrial</SelectItem>
                        <SelectItem value='AGRO_PECUARIA'>
                          Agro-Pecuária
                        </SelectItem>
                        <SelectItem value='ENERGETICA'>Energética</SelectItem>
                        <SelectItem value='SERVICOS'>Serviços</SelectItem>
                        <SelectItem value='OUTRA'>Outra</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {formMethods.watch('activity_type') === 'OUTRA' && (
              <FormField
                control={formMethods.control}
                name='other_activity_type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Activity Type</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Specify other activity type'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={formMethods.control}
                name='development_stage'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Development Stage</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select development stage' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='NOVA'>Nova</SelectItem>
                        <SelectItem value='REABILITACAO'>
                          Reabilitação
                        </SelectItem>
                        <SelectItem value='EXPANSAO'>Expansão</SelectItem>
                        <SelectItem value='OUTRO'>Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {formMethods.watch('development_stage') === 'OUTRO' && (
                <FormField
                  control={formMethods.control}
                  name='other_development_stage'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Development Stage</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Specify other development stage'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={formMethods.control}
              name='proponents'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proponents</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Enter proponents' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={formMethods.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter address' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formMethods.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='Enter email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                control={formMethods.control}
                name='telephone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telephone</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter telephone' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formMethods.control}
                name='mobile_phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Phone</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter mobile phone' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formMethods.control}
                name='fax'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fax</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter fax' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={formMethods.control}
                name='activity_location'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Location</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter activity location' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formMethods.control}
                name='activity_city'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter city' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                control={formMethods.control}
                name='activity_locality'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Locality</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter locality' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formMethods.control}
                name='activity_district'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter district' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formMethods.control}
                name='activity_province'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select province' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='MAPUTO'>Maputo</SelectItem>
                        <SelectItem value='MAPUTO_CITY'>Maputo City</SelectItem>
                        <SelectItem value='GAZA'>Gaza</SelectItem>
                        <SelectItem value='INHAMBANE'>Inhambane</SelectItem>
                        <SelectItem value='SOFALA'>Sofala</SelectItem>
                        <SelectItem value='MANICA'>Manica</SelectItem>
                        <SelectItem value='TETE'>Tete</SelectItem>
                        <SelectItem value='ZAMBEZIA'>Zambezia</SelectItem>
                        <SelectItem value='NAMPULA'>Nampula</SelectItem>
                        <SelectItem value='CABO_DELGADO'>
                          Cabo Delgado
                        </SelectItem>
                        <SelectItem value='NIASSA'>Niassa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={formMethods.control}
              name='geographic_coordinates'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Geographic Coordinates</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter geographic coordinates'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={formMethods.control}
                name='insertion_point'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insertion Point</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select insertion point' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='RURAL'>Rural</SelectItem>
                        <SelectItem value='URBANO'>Urbano</SelectItem>
                        <SelectItem value='PERIURBANO'>Periurbano</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formMethods.control}
                name='territorial_planning_framework'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Territorial Planning Framework</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select framework' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='ESPACO_HABITACIONAL'>
                          Espaço Habitacional
                        </SelectItem>
                        <SelectItem value='INDUSTRIAL'>Industrial</SelectItem>
                        <SelectItem value='SERVICOS'>Serviços</SelectItem>
                        <SelectItem value='OUTRO'>Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={formMethods.control}
              name='activity_infrastructure'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Infrastructure</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe activity infrastructure'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name='associated_activities'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Associated Activities</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe associated activities'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name='construction_operation_technology_description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Construction Operation Technology Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe construction operation technology'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name='main_complementary_activities'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Complementary Activities</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe main complementary activities'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name='labor_type_quantity_origin'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Labor Type, Quantity, and Origin</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Describe labor details' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name='raw_materials_type_quantity_origin_and_provenance'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Raw Materials Type, Quantity, Origin, and Provenance
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe raw materials details'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name='chemicals_used'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chemicals Used</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe chemicals used'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name='type_origin_water_energy_consumption'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Type and Origin of Water and Energy Consumption
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe water and energy consumption'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name='fuels_lubricants_origin'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuels and Lubricants Origin</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe fuels and lubricants origin'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name='other_resources_needed'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Resources Needed</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe other resources needed'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name='land_ownership'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Land Ownership</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe land ownership'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name='activity_location_alternatives'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Location Alternatives</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe location alternatives'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name='brief_description_on_local_regional_ref_env_situation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Brief Description of Local/Regional Environmental Situation
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe environmental situation'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={formMethods.control}
                name='physical_characteristics_of_activity_site'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Physical Characteristics of Activity Site
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select physical characteristics' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='PLANICIE'>Planície</SelectItem>
                        <SelectItem value='PLANALTO'>Planalto</SelectItem>
                        <SelectItem value='VALE'>Vale</SelectItem>
                        <SelectItem value='MONTANHA'>Montanha</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formMethods.control}
                name='predominant_ecosystems'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Predominant Ecosystems</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select ecosystem' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='FLUVIAL'>Fluvial</SelectItem>
                        <SelectItem value='LACUSTRE'>Lacustre</SelectItem>
                        <SelectItem value='MARINHO'>Marinho</SelectItem>
                        <SelectItem value='TERRESTRE'>Terrestre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={formMethods.control}
                name='location_zone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Zone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select location zone' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='COSTEIRA'>Costeira</SelectItem>
                        <SelectItem value='INTERIOR'>Interior</SelectItem>
                        <SelectItem value='ILHA'>Ilha</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formMethods.control}
                name='type_predominant_vegetation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Predominant Vegetation</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select vegetation type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='FLORESTA'>Floresta</SelectItem>
                        <SelectItem value='SAVANA'>Savana</SelectItem>
                        <SelectItem value='OUTRO'>Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={formMethods.control}
              name='land_use'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Land Use</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select land use' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='AGROPECUARIO'>Agropecuário</SelectItem>
                      <SelectItem value='HABITACIONAL'>Habitacional</SelectItem>
                      <SelectItem value='INDUSTRIAL'>Industrial</SelectItem>
                      <SelectItem value='PROTECCAO'>Proteção</SelectItem>
                      <SelectItem value='OUTRO'>Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name='existing_infrastructure_around_activity_area'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Existing Infrastructure Around Activity Area
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe existing infrastructure'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name='total_investment_value'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Investment Value</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Enter total investment value'
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
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
                    {form ? 'Updating...' : 'Creating...'}
                  </>
                ) : form ? (
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
