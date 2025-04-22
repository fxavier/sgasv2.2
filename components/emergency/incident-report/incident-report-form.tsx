'use client';

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
import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PessoaEnvolvidaForm } from './pessoa-envolvida-form';
import { PessoaInvestigacaoForm } from './pessoa-investigacao-form';
import { AcoesImediatasForm } from './acoes-imediatas-form';
import { uploadFileToS3 } from '@/lib/upload-service';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  nome: z.string().min(2, 'Name must be at least 2 characters'),
  funcao: z.string().min(2, 'Function must be at least 2 characters'),
  departamento: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
  subprojecto: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
  data: z.string(),
  hora: z.string(),
  local: z.string().min(2, 'Location must be at least 2 characters'),
  actividade_em_curso: z
    .string()
    .min(5, 'Activity must be at least 5 characters'),
  descricao_do_acidente: z
    .string()
    .min(10, 'Description must be at least 10 characters'),
  tipo_de_incidente: z.enum([
    'Humano',
    'Segurança',
    'Infraestruturas',
    'Ambiental',
    'Social',
    'Outros',
  ]),
  equipamento_envolvido: z
    .string()
    .min(2, 'Equipment must be at least 2 characters'),
  observacao: z.string(),
  colaborador_envolvido_outro_acidente_antes: z.enum(['Sim', 'Não']),
  realizada_analise_risco_impacto_ambiental_antes: z.enum(['Sim', 'Não']),
  existe_procedimento_para_actividade: z.enum(['Sim', 'Não']),
  colaborador_recebeu_treinamento: z.enum(['Sim', 'Não']),
  incidente_envolve_empreteiro: z.enum(['Sim', 'Não']),
  nome_comercial_empreteiro: z.string().optional(),
  natureza_e_extensao_incidente: z.enum([
    'Intoxicação leve',
    'Intoxicação grave',
    'Ferimento leve',
    'Ferimento grave',
    'Morte',
    'Nenhum',
    'Outros',
  ]),
  possiveis_causas_acidente_metodologia: z.enum([
    'Falta de procedimentos para actividade',
    'Falhas no procedimento existente',
    'Falta de plano de trabalho',
    'Falha na comunicação',
    'Outros',
  ]),
  possiveis_causas_acidente_equipamentos: z.enum([
    'Falha de equipamento',
    'Equipamento inapropriado',
    'Falha na protecção do equipamento',
    'Falha na sinalização',
    'Espaço inapropriado para equipamento',
    'Outros',
  ]),
  possiveis_causas_acidente_material: z.enum([
    'Ferramenta defeituosa',
    'Falha na ferramenta',
    'Falta de inventário',
    'EPI inadequado',
    'Outros',
  ]),
  possiveis_causas_acidente_colaboradores: z.enum([
    'Falta de treinamento',
    'Negligência do colaborador',
    'Negligência do operador sazonal',
    'Não concordância com procedimentos',
    'Uso inadequado de equipamento',
    'Outros',
  ]),
  possiveis_causas_acidente_ambiente_e_seguranca: z.enum([
    'Agentes perigosos',
    'Falta de sinalização',
    'Pavimento irregular',
    'Pavimento escorregadio',
    'Outros',
  ]),
  possiveis_causas_acidente_medicoes: z.enum([
    'Falta no instrumento de medição',
    'Instrumento de ajustamento inadequado',
    'Falha no instrumento de calibração',
    'Falta de inspenção',
    'Outros',
  ]),
  pessoa_envolvida: z.object({
    id: z.string(),
    nome: z.string(),
    departamento: z.object({
      id: z.string(),
      name: z.string(),
    }),
    outras_informacoes: z.string(),
  }),
  pessoas_envolvidas_na_investigacao: z
    .array(
      z.object({
        id: z.string(),
        nome: z.string(),
        empresa: z.string(),
        actividade: z.string(),
        assinatura: z.string(),
        data: z.string(),
      })
    )
    .optional(),
  accoes_imediatas_e_correctivas: z
    .array(
      z.object({
        id: z.string(),
        accao: z.string(),
        descricao: z.string(),
        responsavel: z.string(),
        data: z.string(),
        assinatura: z.string(),
      })
    )
    .optional(),
  fotografia_frontal: z.string().optional(),
  fotografia_posterior: z.string().optional(),
  fotografia_lateral_direita: z.string().optional(),
  fotografia_lateral_esquerda: z.string().optional(),
  fotografia_do_melhor_angulo: z.string().optional(),
  fotografia: z.string().optional(),
});

interface IncidentReportFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: IncidentReport | null;
  onClose: () => void;
}

export function IncidentReportForm({
  open,
  onOpenChange,
  report,
  onClose,
}: IncidentReportFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for dropdown data
  const [departments, setDepartments] = useState<Department[]>([]);
  const [subprojects, setSubprojects] = useState<Subproject[]>([]);
  const [pessoasEnvolvidas, setPessoasEnvolvidas] = useState<PessoaEnvolvida[]>(
    []
  );
  const [pessoasInvestigacao, setPessoasInvestigacao] = useState<
    PessoasEnvolvidasNaInvestigacao[]
  >([]);
  const [acoesImediatas, setAcoesImediatas] = useState<
    AccoesImediatasECorrectivas[]
  >([]);

  // State for add dialogs
  const [isAddPessoaEnvolvidaOpen, setIsAddPessoaEnvolvidaOpen] =
    useState(false);
  const [isAddPessoaInvestigacaoOpen, setIsAddPessoaInvestigacaoOpen] =
    useState(false);
  const [isAddAcaoImediataOpen, setIsAddAcaoImediataOpen] = useState(false);

  // State for file uploads
  const [uploadingFrontal, setUploadingFrontal] = useState(false);
  const [uploadingPosterior, setUploadingPosterior] = useState(false);
  const [uploadingLateralDireita, setUploadingLateralDireita] = useState(false);
  const [uploadingLateralEsquerda, setUploadingLateralEsquerda] =
    useState(false);
  const [uploadingMelhorAngulo, setUploadingMelhorAngulo] = useState(false);
  const [uploadingGeral, setUploadingGeral] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: report?.nome || '',
      funcao: report?.funcao || '',
      departamento: report?.departamento,
      subprojecto: report?.subprojecto,
      data: report?.data || format(new Date(), 'yyyy-MM-dd'),
      hora: report?.hora || format(new Date(), 'HH:mm'),
      local: report?.local || '',
      actividade_em_curso: report?.actividade_em_curso || '',
      descricao_do_acidente: report?.descricao_do_acidente || '',
      tipo_de_incidente: report?.tipo_de_incidente || 'Humano',
      equipamento_envolvido: report?.equipamento_envolvido || '',
      observacao: report?.observacao || '',
      colaborador_envolvido_outro_acidente_antes:
        report?.colaborador_envolvido_outro_acidente_antes || 'Não',
      realizada_analise_risco_impacto_ambiental_antes:
        report?.realizada_analise_risco_impacto_ambiental_antes || 'Não',
      existe_procedimento_para_actividade:
        report?.existe_procedimento_para_actividade || 'Não',
      colaborador_recebeu_treinamento:
        report?.colaborador_recebeu_treinamento || 'Não',
      incidente_envolve_empreteiro:
        report?.incidente_envolve_empreteiro || 'Não',
      nome_comercial_empreteiro: report?.nome_comercial_empreteiro || '',
      natureza_e_extensao_incidente:
        report?.natureza_e_extensao_incidente || 'Nenhum',
      possiveis_causas_acidente_metodologia:
        report?.possiveis_causas_acidente_metodologia || 'Outros',
      possiveis_causas_acidente_equipamentos:
        report?.possiveis_causas_acidente_equipamentos || 'Outros',
      possiveis_causas_acidente_material:
        report?.possiveis_causas_acidente_material || 'Outros',
      possiveis_causas_acidente_colaboradores:
        report?.possiveis_causas_acidente_colaboradores || 'Outros',
      possiveis_causas_acidente_ambiente_e_seguranca:
        report?.possiveis_causas_acidente_ambiente_e_seguranca || 'Outros',
      possiveis_causas_acidente_medicoes:
        report?.possiveis_causas_acidente_medicoes || 'Outros',
      pessoa_envolvida: report?.pessoa_envolvida
        ? {
            ...report.pessoa_envolvida,
            id: report.pessoa_envolvida.id?.toString(),
          }
        : undefined,
      pessoas_envolvidas_na_investigacao:
        report?.pessoas_envolvidas_na_investigacao
          ? report.pessoas_envolvidas_na_investigacao.map((p) => ({
              ...p,
              id: p.id?.toString(),
            }))
          : [],
      accoes_imediatas_e_correctivas: report?.accoes_imediatas_e_correctivas
        ? report.accoes_imediatas_e_correctivas.map((a) => ({
            ...a,
            id: a.id?.toString(),
          }))
        : [],
      fotografia_frontal: report?.fotografia_frontal || '',
      fotografia_posterior: report?.fotografia_posterior || '',
      fotografia_lateral_direita: report?.fotografia_lateral_direita || '',
      fotografia_lateral_esquerda: report?.fotografia_lateral_esquerda || '',
      fotografia_do_melhor_angulo: report?.fotografia_do_melhor_angulo || '',
      fotografia: report?.fotografia || '',
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

          // Fetch pessoas envolvidas
          const pessoasResponse = await fetch('/api/pessoas-envolvidas');
          if (pessoasResponse.ok) {
            const pessoasData = await pessoasResponse.json();
            setPessoasEnvolvidas(pessoasData);
          }

          // Fetch pessoas investigacao
          const investigacaoResponse = await fetch('/api/pessoas-investigacao');
          if (investigacaoResponse.ok) {
            const investigacaoData = await investigacaoResponse.json();
            setPessoasInvestigacao(investigacaoData);
          }

          // Fetch acoes imediatas
          const acoesResponse = await fetch('/api/acoes-imediatas');
          if (acoesResponse.ok) {
            const acoesData = await acoesResponse.json();
            setAcoesImediatas(acoesData);
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

  // Update form when report changes
  useEffect(() => {
    if (report) {
      form.reset({
        nome: report.nome,
        funcao: report.funcao,
        departamento: report.departamento,
        subprojecto: report.subprojecto,
        data: report.data,
        hora: report.hora,
        local: report.local,
        actividade_em_curso: report.actividade_em_curso,
        descricao_do_acidente: report.descricao_do_acidente,
        tipo_de_incidente: report.tipo_de_incidente,
        equipamento_envolvido: report.equipamento_envolvido,
        observacao: report.observacao,
        colaborador_envolvido_outro_acidente_antes:
          report.colaborador_envolvido_outro_acidente_antes,
        realizada_analise_risco_impacto_ambiental_antes:
          report.realizada_analise_risco_impacto_ambiental_antes,
        existe_procedimento_para_actividade:
          report.existe_procedimento_para_actividade,
        colaborador_recebeu_treinamento: report.colaborador_recebeu_treinamento,
        incidente_envolve_empreteiro: report.incidente_envolve_empreteiro,
        nome_comercial_empreteiro: report.nome_comercial_empreteiro,
        natureza_e_extensao_incidente: report.natureza_e_extensao_incidente,
        possiveis_causas_acidente_metodologia:
          report.possiveis_causas_acidente_metodologia,
        possiveis_causas_acidente_equipamentos:
          report.possiveis_causas_acidente_equipamentos,
        possiveis_causas_acidente_material:
          report.possiveis_causas_acidente_material,
        possiveis_causas_acidente_colaboradores:
          report.possiveis_causas_acidente_colaboradores,
        possiveis_causas_acidente_ambiente_e_seguranca:
          report.possiveis_causas_acidente_ambiente_e_seguranca,
        possiveis_causas_acidente_medicoes:
          report.possiveis_causas_acidente_medicoes,
        pessoa_envolvida: report.pessoa_envolvida
          ? {
              ...report.pessoa_envolvida,
              id: report.pessoa_envolvida.id?.toString(),
            }
          : undefined,
        pessoas_envolvidas_na_investigacao:
          report.pessoas_envolvidas_na_investigacao
            ? report.pessoas_envolvidas_na_investigacao.map((p) => ({
                ...p,
                id: p.id?.toString(),
              }))
            : [],
        accoes_imediatas_e_correctivas: report.accoes_imediatas_e_correctivas
          ? report.accoes_imediatas_e_correctivas.map((a) => ({
              ...a,
              id: a.id?.toString(),
            }))
          : [],
        fotografia_frontal: report.fotografia_frontal,
        fotografia_posterior: report.fotografia_posterior,
        fotografia_lateral_direita: report.fotografia_lateral_direita,
        fotografia_lateral_esquerda: report.fotografia_lateral_esquerda,
        fotografia_do_melhor_angulo: report.fotografia_do_melhor_angulo,
        fotografia: report.fotografia,
      });
    }
  }, [report, form]);

  const incidente_envolve_empreteiro = form.watch(
    'incidente_envolve_empreteiro'
  );

  const handlePessoaEnvolvidaSuccess = async () => {
    try {
      // Fetch updated pessoas envolvidas
      const response = await fetch('/api/pessoas-envolvidas');
      if (response.ok) {
        const data = await response.json();
        setPessoasEnvolvidas(data);
      }
    } catch (error) {
      console.error('Error fetching pessoas envolvidas:', error);
    }
  };

  const handlePessoaInvestigacaoSuccess = async () => {
    try {
      // Fetch updated pessoas investigacao
      const response = await fetch('/api/pessoas-investigacao');
      if (response.ok) {
        const data = await response.json();
        setPessoasInvestigacao(data);
      }
    } catch (error) {
      console.error('Error fetching pessoas investigacao:', error);
    }
  };

  const handleAcaoImediataSuccess = async () => {
    try {
      // Fetch updated acoes imediatas
      const response = await fetch('/api/acoes-imediatas');
      if (response.ok) {
        const data = await response.json();
        setAcoesImediatas(data);
      }
    } catch (error) {
      console.error('Error fetching acoes imediatas:', error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('Submitting form with values:', values);

      // Check if pessoa_envolvida is undefined or missing required fields
      if (!values.pessoa_envolvida || !values.pessoa_envolvida.id) {
        console.error('Missing required field: pessoa_envolvida');
        toast({
          title: 'Missing information',
          description: 'Please select a person involved in the incident',
          variant: 'destructive',
        });
        return;
      }

      // Check if any uploads are in progress
      if (
        uploadingFrontal ||
        uploadingPosterior ||
        uploadingLateralDireita ||
        uploadingLateralEsquerda ||
        uploadingMelhorAngulo ||
        uploadingGeral
      ) {
        toast({
          title: 'Uploads in progress',
          description:
            'Please wait for all file uploads to complete before submitting the form.',
          variant: 'destructive',
        });
        return;
      }

      setIsSubmitting(true);

      if (report) {
        // Update existing report
        console.log('Updating report:', report.id);
        const response = await fetch(`/api/incident-reports/${report.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Update response error:', errorData);
          throw new Error(
            errorData.error || 'Failed to update incident report'
          );
        }

        toast({
          title: 'Report updated',
          description: 'The incident report has been successfully updated.',
        });
      } else {
        // Create new report
        console.log('Creating new report');
        const response = await fetch('/api/incident-reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Create response error:', errorData);
          throw new Error(
            errorData.error || 'Failed to create incident report'
          );
        }

        toast({
          title: 'Report created',
          description: 'The incident report has been successfully created.',
        });
      }

      form.reset();
      onClose();
    } catch (error) {
      console.error('Error saving incident report:', error);
      toast({
        title: 'Error',
        description:
          'There was an error saving the incident report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file uploads
  const handleFileUpload = async (
    file: File,
    fieldName: string,
    setUploading: (loading: boolean) => void
  ) => {
    if (!file) return;

    try {
      setUploading(true);
      const fileUrl = await uploadFileToS3(file);
      form.setValue(fieldName as any, fileUrl);
      toast({
        title: 'Upload successful',
        description: 'The file has been uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading the file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
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
        <DialogContent className='sm:max-w-[800px] h-[90vh] max-h-[90vh] flex flex-col p-0 overflow-hidden'>
          <DialogHeader className='px-6 py-4 border-b'>
            <DialogTitle>
              {report ? 'Edit Incident Report' : 'Create Incident Report'}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              id='incident-report-form'
              className='flex flex-col flex-1 h-full overflow-hidden'
            >
              <ScrollArea
                className='flex-1 p-6 h-full'
                type='always'
                scrollHideDelay={0}
              >
                <div className='space-y-6 pb-4'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
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
                      name='funcao'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Function</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter function' {...field} />
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
                              field.onChange(selected);
                            }}
                            value={field.value?.id}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select department' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id || ''}>
                                  {dept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <FormField
                      control={form.control}
                      name='subprojecto'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subproject</FormLabel>
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
                            <PopoverContent
                              className='w-auto p-0'
                              align='start'
                            >
                              <Calendar
                                mode='single'
                                selected={new Date(field.value)}
                                onSelect={(date) =>
                                  field.onChange(format(date!, 'yyyy-MM-dd'))
                                }
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date('1900-01-01')
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
                      name='hora'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input type='time' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                      control={form.control}
                      name='local'
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
                      name='actividade_em_curso'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activity in Progress</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter activity in progress'
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
                    name='descricao_do_acidente'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accident Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Describe the accident'
                            className='min-h-[100px]'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                      control={form.control}
                      name='tipo_de_incidente'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Incident Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select incident type' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='Humano'>Humano</SelectItem>
                              <SelectItem value='Segurança'>
                                Segurança
                              </SelectItem>
                              <SelectItem value='Infraestruturas'>
                                Infraestruturas
                              </SelectItem>
                              <SelectItem value='Ambiental'>
                                Ambiental
                              </SelectItem>
                              <SelectItem value='Social'>Social</SelectItem>
                              <SelectItem value='Outros'>Outros</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='equipamento_envolvido'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Equipment Involved</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter equipment involved'
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
                    name='observacao'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observation</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Enter observations'
                            className='min-h-[100px]'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                      control={form.control}
                      name='colaborador_envolvido_outro_acidente_antes'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Collaborator Involved in Another Accident Before
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select option' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='Sim'>Sim</SelectItem>
                              <SelectItem value='Não'>Não</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='realizada_analise_risco_impacto_ambiental_antes'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Environmental Risk Analysis Performed Before
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select option' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='Sim'>Sim</SelectItem>
                              <SelectItem value='Não'>Não</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                      control={form.control}
                      name='existe_procedimento_para_actividade'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Procedure Exists for Activity</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select option' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='Sim'>Sim</SelectItem>
                              <SelectItem value='Não'>Não</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='colaborador_recebeu_treinamento'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Collaborator Received Training</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select option' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='Sim'>Sim</SelectItem>
                              <SelectItem value='Não'>Não</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                      control={form.control}
                      name='incidente_envolve_empreteiro'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Incident Involves Contractor</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select option' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='Sim'>Sim</SelectItem>
                              <SelectItem value='Não'>Não</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {incidente_envolve_empreteiro === 'Sim' && (
                      <FormField
                        control={form.control}
                        name='nome_comercial_empreteiro'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contractor Commercial Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Enter contractor name'
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
                    control={form.control}
                    name='natureza_e_extensao_incidente'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nature and Extent of Incident</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select nature' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='Intoxicação leve'>
                              Intoxicação leve
                            </SelectItem>
                            <SelectItem value='Intoxicação grave'>
                              Intoxicação grave
                            </SelectItem>
                            <SelectItem value='Ferimento leve'>
                              Ferimento leve
                            </SelectItem>
                            <SelectItem value='Ferimento grave'>
                              Ferimento grave
                            </SelectItem>
                            <SelectItem value='Morte'>Morte</SelectItem>
                            <SelectItem value='Nenhum'>Nenhum</SelectItem>
                            <SelectItem value='Outros'>Outros</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold'>
                      Possible Causes of Accident
                    </h3>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <FormField
                        control={form.control}
                        name='possiveis_causas_acidente_metodologia'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Methodology</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select cause' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='Falta de procedimentos para actividade'>
                                  Falta de procedimentos para actividade
                                </SelectItem>
                                <SelectItem value='Falhas no procedimento existente'>
                                  Falhas no procedimento existente
                                </SelectItem>
                                <SelectItem value='Falta de plano de trabalho'>
                                  Falta de plano de trabalho
                                </SelectItem>
                                <SelectItem value='Falha na comunicação'>
                                  Falha na comunicação
                                </SelectItem>
                                <SelectItem value='Outros'>Outros</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='possiveis_causas_acidente_equipamentos'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Equipment</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select cause' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='Falha de equipamento'>
                                  Falha de equipamento
                                </SelectItem>
                                <SelectItem value='Equipamento inapropriado'>
                                  Equipamento inapropriado
                                </SelectItem>
                                <SelectItem value='Falha na protecção do equipamento'>
                                  Falha na protecção do equipamento
                                </SelectItem>
                                <SelectItem value='Falha na sinalização'>
                                  Falha na sinalização
                                </SelectItem>
                                <SelectItem value='Espaço inapropriado para equipamento'>
                                  Espaço inapropriado para equipamento
                                </SelectItem>
                                <SelectItem value='Outros'>Outros</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <FormField
                        control={form.control}
                        name='possiveis_causas_acidente_material'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Material</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select cause' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='Ferramenta defeituosa'>
                                  Ferramenta defeituosa
                                </SelectItem>
                                <SelectItem value='Falha na ferramenta'>
                                  Falha na ferramenta
                                </SelectItem>
                                <SelectItem value='Falta de inventário'>
                                  Falta de inventário
                                </SelectItem>
                                <SelectItem value='EPI inadequado'>
                                  EPI inadequado
                                </SelectItem>
                                <SelectItem value='Outros'>Outros</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='possiveis_causas_acidente_colaboradores'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Collaborators</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select cause' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='Falta de treinamento'>
                                  Falta de treinamento
                                </SelectItem>
                                <SelectItem value='Negligência do colaborador'>
                                  Negligência do colaborador
                                </SelectItem>
                                <SelectItem value='Negligência do operador sazonal'>
                                  Negligência do operador sazonal
                                </SelectItem>
                                <SelectItem value='Não concordância com procedimentos'>
                                  Não concordância com procedimentos
                                </SelectItem>
                                <SelectItem value='Uso inadequado de equipamento'>
                                  Uso inadequado de equipamento
                                </SelectItem>
                                <SelectItem value='Outros'>Outros</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <FormField
                        control={form.control}
                        name='possiveis_causas_acidente_ambiente_e_seguranca'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Environment and Safety</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select cause' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='Agentes perigosos'>
                                  Agentes perigosos
                                </SelectItem>
                                <SelectItem value='Falta de sinalização'>
                                  Falta de sinalização
                                </SelectItem>
                                <SelectItem value='Pavimento irregular'>
                                  Pavimento irregular
                                </SelectItem>
                                <SelectItem value='Pavimento escorregadio'>
                                  Pavimento escorregadio
                                </SelectItem>
                                <SelectItem value='Outros'>Outros</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='possiveis_causas_acidente_medicoes'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Measurements</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select cause' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='Falta no instrumento de medição'>
                                  Falta no instrumento de medição
                                </SelectItem>
                                <SelectItem value='Instrumento de ajustamento inadequado'>
                                  Instrumento de ajustamento inadequado
                                </SelectItem>
                                <SelectItem value='Falha no instrumento de calibração'>
                                  Falha no instrumento de calibração
                                </SelectItem>
                                <SelectItem value='Falta de inspenção'>
                                  Falta de inspenção
                                </SelectItem>
                                <SelectItem value='Outros'>Outros</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name='pessoa_envolvida'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Person Involved</FormLabel>
                        <div className='flex gap-2'>
                          <Select
                            onValueChange={(value) => {
                              const selected = pessoasEnvolvidas.find(
                                (pessoa) => pessoa.id?.toString() === value
                              );
                              field.onChange(selected);
                            }}
                            value={field.value?.id?.toString() || ''}
                          >
                            <FormControl>
                              <SelectTrigger className='w-full'>
                                <SelectValue
                                  placeholder='Select person involved'
                                  className='text-ellipsis overflow-hidden'
                                >
                                  {field.value?.nome
                                    ? `${field.value.nome} - ${
                                        field.value.departamento?.name || ''
                                      }`
                                    : 'Select person involved'}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {pessoasEnvolvidas.map((pessoa) => (
                                <SelectItem
                                  key={pessoa.id}
                                  value={pessoa.id?.toString() || ''}
                                >
                                  {pessoa.nome} - {pessoa.departamento.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            type='button'
                            variant='outline'
                            size='icon'
                            onClick={() => setIsAddPessoaEnvolvidaOpen(true)}
                          >
                            <Plus className='h-4 w-4' />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <h3 className='text-lg font-semibold'>
                        People Involved in Investigation
                      </h3>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => setIsAddPessoaInvestigacaoOpen(true)}
                      >
                        <Plus className='h-4 w-4 mr-2' />
                        Add Person
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name='pessoas_envolvidas_na_investigacao'
                      render={({ field }) => (
                        <FormItem>
                          <div className='border rounded-md p-4'>
                            {pessoasInvestigacao.length > 0 ? (
                              <div className='space-y-2'>
                                {pessoasInvestigacao.map((pessoa) => (
                                  <div
                                    key={pessoa.id?.toString()}
                                    className='flex items-center justify-between p-2 bg-gray-50 rounded-md'
                                  >
                                    <div>
                                      <p className='font-medium'>
                                        {pessoa.nome}
                                      </p>
                                      <p className='text-sm text-gray-500'>
                                        {pessoa.empresa} - {pessoa.actividade}
                                      </p>
                                    </div>
                                    <Button
                                      type='button'
                                      variant='ghost'
                                      size='sm'
                                      onClick={() => {
                                        const isSelected = field.value?.some(
                                          (p) =>
                                            p.id?.toString() ===
                                            pessoa.id?.toString()
                                        );
                                        if (isSelected) {
                                          field.onChange(
                                            field.value?.filter(
                                              (p) =>
                                                p.id?.toString() !==
                                                pessoa.id?.toString()
                                            ) || []
                                          );
                                        } else {
                                          field.onChange([
                                            ...(field.value || []),
                                            {
                                              ...pessoa,
                                              id: pessoa.id?.toString() || '',
                                            },
                                          ]);
                                        }
                                      }}
                                    >
                                      {field.value?.some(
                                        (p) => p.id === pessoa.id?.toString()
                                      )
                                        ? 'Remove'
                                        : 'Add'}
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className='text-center text-gray-500 py-4'>
                                No people involved in investigation available
                              </p>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <h3 className='text-lg font-semibold'>
                        Immediate and Corrective Actions
                      </h3>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => setIsAddAcaoImediataOpen(true)}
                      >
                        <Plus className='h-4 w-4 mr-2' />
                        Add Action
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name='accoes_imediatas_e_correctivas'
                      render={({ field }) => (
                        <FormItem>
                          <div className='border rounded-md p-4'>
                            {acoesImediatas.length > 0 ? (
                              <div className='space-y-2'>
                                {acoesImediatas.map((acao) => (
                                  <div
                                    key={acao.id?.toString()}
                                    className='flex items-center justify-between p-2 bg-gray-50 rounded-md'
                                  >
                                    <div>
                                      <p className='font-medium'>
                                        {acao.accao}
                                      </p>
                                      <p className='text-sm text-gray-500'>
                                        {acao.responsavel} -{' '}
                                        {new Date(
                                          acao.data
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <Button
                                      type='button'
                                      variant='ghost'
                                      size='sm'
                                      onClick={() => {
                                        const isSelected = field.value?.some(
                                          (a) =>
                                            a.id?.toString() ===
                                            acao.id?.toString()
                                        );
                                        if (isSelected) {
                                          field.onChange(
                                            field.value?.filter(
                                              (a) =>
                                                a.id?.toString() !==
                                                acao.id?.toString()
                                            ) || []
                                          );
                                        } else {
                                          field.onChange([
                                            ...(field.value || []),
                                            {
                                              ...acao,
                                              id: acao.id?.toString() || '',
                                            },
                                          ]);
                                        }
                                      }}
                                    >
                                      {field.value?.some(
                                        (a) =>
                                          a.id?.toString() ===
                                          acao.id?.toString()
                                      )
                                        ? 'Remove'
                                        : 'Add'}
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className='text-center text-gray-500 py-4'>
                                No immediate actions available
                              </p>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold'>Photos</h3>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <FormField
                        control={form.control}
                        name='fotografia_frontal'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Front Photo</FormLabel>
                            <div className='flex flex-col gap-2'>
                              <div className='flex items-center gap-2'>
                                <Input
                                  type='file'
                                  accept='image/*'
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      handleFileUpload(
                                        e.target.files[0],
                                        'fotografia_frontal',
                                        setUploadingFrontal
                                      );
                                    }
                                  }}
                                  disabled={uploadingFrontal}
                                />
                                {uploadingFrontal && (
                                  <Loader2 className='h-4 w-4 animate-spin' />
                                )}
                              </div>
                              {field.value && (
                                <div className='flex items-center gap-2'>
                                  <a
                                    href={field.value}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-sm text-blue-500 hover:underline truncate max-w-xs'
                                  >
                                    {field.value.split('/').pop()}
                                  </a>
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => {
                                      form.setValue('fotografia_frontal', '');
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )}
                              <input type='hidden' {...field} />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='fotografia_posterior'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Back Photo</FormLabel>
                            <div className='flex flex-col gap-2'>
                              <div className='flex items-center gap-2'>
                                <Input
                                  type='file'
                                  accept='image/*'
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      handleFileUpload(
                                        e.target.files[0],
                                        'fotografia_posterior',
                                        setUploadingPosterior
                                      );
                                    }
                                  }}
                                  disabled={uploadingPosterior}
                                />
                                {uploadingPosterior && (
                                  <Loader2 className='h-4 w-4 animate-spin' />
                                )}
                              </div>
                              {field.value && (
                                <div className='flex items-center gap-2'>
                                  <a
                                    href={field.value}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-sm text-blue-500 hover:underline truncate max-w-xs'
                                  >
                                    {field.value.split('/').pop()}
                                  </a>
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => {
                                      form.setValue('fotografia_posterior', '');
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )}
                              <input type='hidden' {...field} />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <FormField
                        control={form.control}
                        name='fotografia_lateral_direita'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Right Side Photo</FormLabel>
                            <div className='flex flex-col gap-2'>
                              <div className='flex items-center gap-2'>
                                <Input
                                  type='file'
                                  accept='image/*'
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      handleFileUpload(
                                        e.target.files[0],
                                        'fotografia_lateral_direita',
                                        setUploadingLateralDireita
                                      );
                                    }
                                  }}
                                  disabled={uploadingLateralDireita}
                                />
                                {uploadingLateralDireita && (
                                  <Loader2 className='h-4 w-4 animate-spin' />
                                )}
                              </div>
                              {field.value && (
                                <div className='flex items-center gap-2'>
                                  <a
                                    href={field.value}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-sm text-blue-500 hover:underline truncate max-w-xs'
                                  >
                                    {field.value.split('/').pop()}
                                  </a>
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => {
                                      form.setValue(
                                        'fotografia_lateral_direita',
                                        ''
                                      );
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )}
                              <input type='hidden' {...field} />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='fotografia_lateral_esquerda'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Left Side Photo</FormLabel>
                            <div className='flex flex-col gap-2'>
                              <div className='flex items-center gap-2'>
                                <Input
                                  type='file'
                                  accept='image/*'
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      handleFileUpload(
                                        e.target.files[0],
                                        'fotografia_lateral_esquerda',
                                        setUploadingLateralEsquerda
                                      );
                                    }
                                  }}
                                  disabled={uploadingLateralEsquerda}
                                />
                                {uploadingLateralEsquerda && (
                                  <Loader2 className='h-4 w-4 animate-spin' />
                                )}
                              </div>
                              {field.value && (
                                <div className='flex items-center gap-2'>
                                  <a
                                    href={field.value}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-sm text-blue-500 hover:underline truncate max-w-xs'
                                  >
                                    {field.value.split('/').pop()}
                                  </a>
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => {
                                      form.setValue(
                                        'fotografia_lateral_esquerda',
                                        ''
                                      );
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )}
                              <input type='hidden' {...field} />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <FormField
                        control={form.control}
                        name='fotografia_do_melhor_angulo'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Best Angle Photo</FormLabel>
                            <div className='flex flex-col gap-2'>
                              <div className='flex items-center gap-2'>
                                <Input
                                  type='file'
                                  accept='image/*'
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      handleFileUpload(
                                        e.target.files[0],
                                        'fotografia_do_melhor_angulo',
                                        setUploadingMelhorAngulo
                                      );
                                    }
                                  }}
                                  disabled={uploadingMelhorAngulo}
                                />
                                {uploadingMelhorAngulo && (
                                  <Loader2 className='h-4 w-4 animate-spin' />
                                )}
                              </div>
                              {field.value && (
                                <div className='flex items-center gap-2'>
                                  <a
                                    href={field.value}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-sm text-blue-500 hover:underline truncate max-w-xs'
                                  >
                                    {field.value.split('/').pop()}
                                  </a>
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => {
                                      form.setValue(
                                        'fotografia_do_melhor_angulo',
                                        ''
                                      );
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )}
                              <input type='hidden' {...field} />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='fotografia'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>General Photo</FormLabel>
                            <div className='flex flex-col gap-2'>
                              <div className='flex items-center gap-2'>
                                <Input
                                  type='file'
                                  accept='image/*'
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      handleFileUpload(
                                        e.target.files[0],
                                        'fotografia',
                                        setUploadingGeral
                                      );
                                    }
                                  }}
                                  disabled={uploadingGeral}
                                />
                                {uploadingGeral && (
                                  <Loader2 className='h-4 w-4 animate-spin' />
                                )}
                              </div>
                              {field.value && (
                                <div className='flex items-center gap-2'>
                                  <a
                                    href={field.value}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-sm text-blue-500 hover:underline truncate max-w-xs'
                                  >
                                    {field.value.split('/').pop()}
                                  </a>
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => {
                                      form.setValue('fotografia', '');
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )}
                              <input type='hidden' {...field} />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className='flex justify-end gap-4 p-6 border-t mt-auto'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  onClick={(e) => {
                    e.preventDefault();
                    // Log form state before submission to help debug
                    console.log('Form values:', form.getValues());
                    console.log('Form errors:', form.formState.errors);

                    // Manually trigger form validation and submission
                    form.handleSubmit(onSubmit)();
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      {report ? 'Updating...' : 'Creating...'}
                    </>
                  ) : report ? (
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

      {/* Pessoa Envolvida Form */}
      <PessoaEnvolvidaForm
        open={isAddPessoaEnvolvidaOpen}
        onOpenChange={setIsAddPessoaEnvolvidaOpen}
        onClose={() => setIsAddPessoaEnvolvidaOpen(false)}
        onSuccess={handlePessoaEnvolvidaSuccess}
      />

      {/* Pessoa Investigacao Form */}
      <PessoaInvestigacaoForm
        open={isAddPessoaInvestigacaoOpen}
        onOpenChange={setIsAddPessoaInvestigacaoOpen}
        onClose={() => setIsAddPessoaInvestigacaoOpen(false)}
        onSuccess={handlePessoaInvestigacaoSuccess}
      />

      {/* Acoes Imediatas Form */}
      <AcoesImediatasForm
        open={isAddAcaoImediataOpen}
        onOpenChange={setIsAddAcaoImediataOpen}
        onClose={() => setIsAddAcaoImediataOpen(false)}
        onSuccess={handleAcaoImediataSuccess}
      />
    </>
  );
}
