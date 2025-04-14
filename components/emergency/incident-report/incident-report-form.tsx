"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data
const mockDepartments = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Operations" },
  { id: 3, name: "Safety" },
];

const mockSubprojects = [
  { id: 1, name: "Project Alpha" },
  { id: 2, name: "Project Beta" },
  { id: 3, name: "Project Gamma" },
];

const formSchema = z.object({
  nome: z.string().min(2, "Name must be at least 2 characters"),
  funcao: z.string().min(2, "Function must be at least 2 characters"),
  departamento: z.object({
    id: z.number(),
    name: z.string(),
  }).optional(),
  subprojecto: z.object({
    id: z.number(),
    name: z.string(),
  }).optional(),
  data: z.string(),
  hora: z.string(),
  local: z.string().min(2, "Location must be at least 2 characters"),
  actividade_em_curso: z.string().min(2, "Activity must be at least 2 characters"),
  descricao_do_acidente: z.string().min(10, "Description must be at least 10 characters"),
  tipo_de_incidente: z.enum(['Humano', 'Segurança', 'Infraestruturas', 'Ambiental', 'Social', 'Outros']),
  equipamento_envolvido: z.string().min(2, "Equipment must be at least 2 characters"),
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
    'Outros'
  ]),
  possiveis_causas_acidente_metodologia: z.enum([
    'Falta de procedimentos para actividade',
    'Falhas no procedimento existente',
    'Falta de plano de trabalho',
    'Falha na comunicação',
    'Outros'
  ]),
  possiveis_causas_acidente_equipamentos: z.enum([
    'Falha de equipamento',
    'Equipamento inapropriado',
    'Falha na protecção do equipamento',
    'Falha na sinalização',
    'Espaço inapropriado para equipamento',
    'Outros'
  ]),
  possiveis_causas_acidente_material: z.enum([
    'Ferramenta defeituosa',
    'Falha na ferramenta',
    'Falta de inventário',
    'EPI inadequado',
    'Outros'
  ]),
  possiveis_causas_acidente_colaboradores: z.enum([
    'Falta de treinamento',
    'Negligência do colaborador',
    'Negligência do operador sazonal',
    'Não concordância com procedimentos',
    'Uso inadequado de equipamento',
    'Outros'
  ]),
  possiveis_causas_acidente_ambiente_e_seguranca: z.enum([
    'Agentes perigosos',
    'Falta de sinalização',
    'Pavimento irregular',
    'Pavimento escorregadio',
    'Outros'
  ]),
  possiveis_causas_acidente_medicoes: z.enum([
    'Falta no instrumento de medição',
    'Instrumento de ajustamento inadequado',
    'Falha no instrumento de calibração',
    'Falta de inspenção',
    'Outros'
  ]),
  pessoa_envolvida: z.object({
    nome: z.string().min(2, "Name must be at least 2 characters"),
    departamento: z.object({
      id: z.number(),
      name: z.string(),
    }),
    outras_informacoes: z.string(),
  }),
  pessoas_envolvidas_na_investigacao: z.array(z.object({
    nome: z.string(),
    empresa: z.string(),
    actividade: z.string(),
    assinatura: z.string(),
    data: z.string(),
  })),
  accoes_imediatas_e_correctivas: z.array(z.object({
    accao: z.string(),
    descricao: z.string(),
    responsavel: z.string(),
    data: z.string(),
    assinatura: z.string(),
  })),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: report?.nome || "",
      funcao: report?.funcao || "",
      departamento: report?.departamento,
      subprojecto: report?.subprojecto,
      data: report?.data || format(new Date(), "yyyy-MM-dd"),
      hora: report?.hora || format(new Date(), "HH:mm"),
      local: report?.local || "",
      actividade_em_curso: report?.actividade_em_curso || "",
      descricao_do_acidente: report?.descricao_do_acidente || "",
      tipo_de_incidente: report?.tipo_de_incidente || "Humano",
      equipamento_envolvido: report?.equipamento_envolvido || "",
      observacao: report?.observacao || "",
      colaborador_envolvido_outro_acidente_antes: report?.colaborador_envolvido_outro_acidente_antes || "Não",
      realizada_analise_risco_impacto_ambiental_antes: report?.realizada_analise_risco_impacto_ambiental_antes || "Não",
      existe_procedimento_para_actividade: report?.existe_procedimento_para_actividade || "Não",
      colaborador_recebeu_treinamento: report?.colaborador_recebeu_treinamento || "Não",
      incidente_envolve_empreteiro: report?.incidente_envolve_empreteiro || "Não",
      nome_comercial_empreteiro: report?.nome_comercial_empreteiro || "",
      natureza_e_extensao_incidente: report?.natureza_e_extensao_incidente || "Nenhum",
      possiveis_causas_acidente_metodologia: report?.possiveis_causas_acidente_metodologia || "Outros",
      possiveis_causas_acidente_equipamentos: report?.possiveis_causas_acidente_equipamentos || "Outros",
      possiveis_causas_acidente_material: report?.possiveis_causas_acidente_material || "Outros",
      possiveis_causas_acidente_colaboradores: report?.possiveis_causas_acidente_colaboradores || "Outros",
      possiveis_causas_acidente_ambiente_e_seguranca: report?.possiveis_causas_acidente_ambiente_e_seguranca || "Outros",
      possiveis_causas_acidente_medicoes: report?.possiveis_causas_acidente_medicoes || "Outros",
      pessoa_envolvida: report?.pessoa_envolvida || {
        nome: "",
        departamento: mockDepartments[0],
        outras_informacoes: "",
      },
      pessoas_envolvidas_na_investigacao: report?.pessoas_envolvidas_na_investigacao || [],
      accoes_imediatas_e_correctivas: report?.accoes_imediatas_e_correctivas || [],
    },
  });

  const incidenteEnvolveEmpreteiro = form.watch('incidente_envolve_empreteiro');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      
      toast({
        title: report ? "Report updated" : "Report created",
        description: report
          ? "The incident report has been successfully updated."
          : "The incident report has been successfully created.",
      });
      
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>
            {report ? "Edit Incident Report" : "Create Incident Report"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="funcao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Function</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter function" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="departamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const selected = mockDepartments.find(
                            (dept) => dept.id === parseInt(value)
                          );
                          field.onChange(selected);
                        }}
                        value={field.value?.id?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockDepartments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id.toString()}>
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
                  name="subprojecto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subproject</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const selected = mockSubprojects.find(
                            (proj) => proj.id === parseInt(value)
                          );
                          field.onChange(selected);
                        }}
                        value={field.value?.id?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subproject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockSubprojects.map((proj) => (
                            <SelectItem key={proj.id} value={proj.id.toString()}>
                              {proj.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="data"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={new Date(field.value)}
                            onSelect={(date) => field.onChange(format(date!, "yyyy-MM-dd"))}
                            disabled={(date) =>
                              date < new Date("1900-01-01")
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
                  name="hora"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="local"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="actividade_em_curso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Activity</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter current activity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="descricao_do_acidente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accident Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the accident"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="tipo_de_incidente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incident Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select incident type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Humano">Humano</SelectItem>
                          <SelectItem value="Segurança">Segurança</SelectItem>
                          <SelectItem value="Infraestruturas">Infraestruturas</SelectItem>
                          <SelectItem value="Ambiental">Ambiental</SelectItem>
                          <SelectItem value="Social">Social</SelectItem>
                          <SelectItem value="Outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="equipamento_envolvido"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equipment Involved</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter equipment involved" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="observacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observations</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter observations"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="colaborador_envolvido_outro_acidente_antes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Involved in Previous Accident</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sim">Sim</SelectItem>
                          <SelectItem value="Não">Não</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="realizada_analise_risco_impacto_ambiental_antes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Environmental Risk Analysis Performed</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sim">Sim</SelectItem>
                          <SelectItem value="Não">Não</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="existe_procedimento_para_actividade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Procedure Exists for Activity</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sim">Sim</SelectItem>
                          <SelectItem value="Não">Não</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="colaborador_recebeu_treinamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Received Training</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sim">Sim</SelectItem>
                          <SelectItem value="Não">Não</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="incidente_envolve_empreteiro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incident Involves Contractor</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sim">Sim</SelectItem>
                          <SelectItem value="Não">Não</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {incidenteEnvolveEmpreteiro === 'Sim' && (
                  <FormField
                    control={form.control}
                    name="nome_comercial_empreteiro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contractor Commercial Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter contractor name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="natureza_e_extensao_incidente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nature and Extent of Incident</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select nature and extent" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Intoxicação leve">Intoxicação leve</SelectItem>
                        <SelectItem value="Intoxicação grave">Intoxicação grave</SelectItem>
                        <SelectItem value="Ferimento leve">Ferimento leve</SelectItem>
                        <SelectItem value="Ferimento grave">Ferimento grave</SelectItem>
                        <SelectItem value="Morte">Morte</SelectItem>
                        <SelectItem value="Nenhum">Nenhum</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Possible Causes of Accident</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="possiveis_causas_acidente_metodologia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Methodology</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select methodology cause" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Falta de procedimentos para actividade">
                              Falta de procedimentos para actividade
                            </SelectItem>
                            <SelectItem value="Falhas no procedimento existente">
                              Falhas no procedimento existente
                            </SelectItem>
                            <SelectItem value="Falta de plano de trabalho">
                              Falta de plano de trabalho
                            </SelectItem>
                            <SelectItem value="Falha na comunicação">
                              Falha na comunicação
                            </SelectItem>
                            <SelectItem value="Outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="possiveis_causas_acidente_equipamentos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipment</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select equipment cause" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Falha de equipamento">
                              Falha de equipamento
                            </SelectItem>
                            <SelectItem value="Equipamento inapropriado">
                              Equipamento inapropriado
                            </SelectItem>
                            <SelectItem value="Falha na protecção do equipamento">
                              Falha na protecção do equipamento
                            </SelectItem>
                            <SelectItem value="Falha na sinalização">
                              Falha na sinalização
                            </SelectItem>
                            <SelectItem value="Espaço inapropriado para equipamento">
                              Espaço inapropriado para equipamento
                            </SelectItem>
                            <SelectItem value="Outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="possiveis_causas_acidente_material"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Material</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select material cause" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Ferramenta defeituosa">
                              Ferramenta defeituosa
                            </SelectItem>
                            <SelectItem value="Falha na ferramenta">
                              Falha na ferramenta
                            </SelectItem>
                            <SelectItem value="Falta de inventário">
                              Falta de inventário
                            </SelectItem>
                            <SelectItem value="EPI inadequado">
                              EPI inadequado
                            </SelectItem>
                            <SelectItem value="Outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="possiveis_causas_acidente_colaboradores"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employees</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select employee cause" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Falta de treinamento">
                              Falta de treinamento
                            </SelectItem>
                            <SelectItem value="Negligência do colaborador">
                              Negligência do colaborador
                            </SelectItem>
                            <SelectItem value="Negligência do operador sazonal">
                              Negligência do operador sazonal
                            </SelectItem>
                            <SelectItem value="Não concordância com procedimentos">
                              Não concordância com procedimentos
                            </SelectItem>
                            <SelectItem value="Uso inadequado de equipamento">
                              Uso inadequado de equipamento
                            </SelectItem>
                            <SelectItem value="Outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="possiveis_causas_acidente_ambiente_e_seguranca"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Environment and Safety</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select environment cause" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Agentes perigosos">
                              Agentes perigosos
                            </SelectItem>
                            <SelectItem value="Falta de sinalização">
                              Falta de sinalização
                            </SelectItem>
                            <SelectItem value="Pavimento irregular">
                              Pavimento irregular
                            </SelectItem>
                            <SelectItem value="Pavimento escorregadio">
                              Pavimento escorregadio
                            </SelectItem>
                            <SelectItem value="Outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="possiveis_causas_acidente_medicoes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Measurements</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select measurement cause" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Falta no instrumento de medição">
                              Falta no instrumento de medição
                            </SelectItem>
                            <SelectItem value="Instrumento de ajustamento inadequado">
                              Instrumento de ajustamento inadequado
                            </SelectItem>
                            <SelectItem value="Falha no instrumento de calibração">
                              Falha no instrumento de calibração
                            </SelectItem>
                            <SelectItem value="Falta de inspenção">
                              Falta de inspenção
                            </SelectItem>
                            <SelectItem value="Outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Person Involved</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="pessoa_envolvida.nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pessoa_envolvida.departamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            const selected = mockDepartments.find(
                              (dept) => dept.id === parseInt(value)
                            );
                            field.onChange(selected);
                          }}
                          value={field.value?.id?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockDepartments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id.toString()}>
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

                <FormField
                  control={form.control}
                  name="pessoa_envolvida.outras_informacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Information</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter other information"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </ScrollArea>
        <div className="flex justify-end gap-4 p-6 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            {report ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}