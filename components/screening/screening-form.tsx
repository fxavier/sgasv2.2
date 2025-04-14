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

const formSchema = z.object({
  responsible_for_filling_form: z.object({
    id: z.number(),
    name: z.string(),
  }),
  responsible_for_verification: z.object({
    id: z.number(),
    name: z.string(),
  }),
  subproject: z.object({
    id: z.number(),
    name: z.string(),
  }),
  biodiversidade_recursos_naturais: z.object({
    id: z.number(),
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

// Mock data
const mockResponsibles = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
];

const mockSubprojects = [
  { id: 1, name: "Project Alpha" },
  { id: 2, name: "Project Beta" },
];

const mockBiodiversidade = [
  { id: 1, description: "Flora" },
  { id: 2, description: "Fauna" },
];

interface ScreeningFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  screening: EnvironmentalSocialScreening | null;
  onClose: () => void;
}

export function ScreeningForm({
  open,
  onOpenChange,
  screening,
  onClose,
}: ScreeningFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responsible_for_filling_form: screening?.responsible_for_filling_form || undefined,
      responsible_for_verification: screening?.responsible_for_verification || undefined,
      subproject: screening?.subproject || undefined,
      biodiversidade_recursos_naturais: screening?.biodiversidade_recursos_naturais || undefined,
      response: screening?.response || 'NAO',
      comment: screening?.comment || "",
      relevant_standard: screening?.relevant_standard || "",
      consultation_and_engagement: screening?.consultation_and_engagement || "",
      recomended_actions: screening?.recomended_actions || "",
      screening_results: screening?.screening_results || {
        risk_category: 'BAIXO',
        description: "",
        instruments_to_be_developed: "",
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      
      toast({
        title: screening ? "Screening updated" : "Screening created",
        description: screening
          ? "The screening form has been successfully updated."
          : "The screening form has been successfully created.",
      });
      
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving the screening form. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {screening ? "Edit Screening Form" : "Create Screening Form"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="responsible_for_filling_form"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsible for Filling</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const selected = mockResponsibles.find(
                          (resp) => resp.id === parseInt(value)
                        );
                        field.onChange(selected);
                      }}
                      value={field.value?.id?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select responsible" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockResponsibles.map((resp) => (
                          <SelectItem key={resp.id} value={resp.id.toString()}>
                            {resp.name}
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
                name="responsible_for_verification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsible for Verification</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const selected = mockResponsibles.find(
                          (resp) => resp.id === parseInt(value)
                        );
                        field.onChange(selected);
                      }}
                      value={field.value?.id?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select responsible" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockResponsibles.map((resp) => (
                          <SelectItem key={resp.id} value={resp.id.toString()}>
                            {resp.name}
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
              name="subproject"
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

            <FormField
              control={form.control}
              name="biodiversidade_recursos_naturais"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biodiversidade e Recursos Naturais</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const selected = mockBiodiversidade.find(
                        (bio) => bio.id === parseInt(value)
                      );
                      field.onChange(selected);
                    }}
                    value={field.value?.id?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select biodiversidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockBiodiversidade.map((bio) => (
                        <SelectItem key={bio.id} value={bio.id.toString()}>
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
              name="response"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Response</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select response" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SIM">Sim</SelectItem>
                      <SelectItem value="NAO">Não</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a comment"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relevant_standard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relevant Standard</FormLabel>
                  <FormControl>
                    <Input placeholder="Relevant standard" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="consultation_and_engagement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consultation and Engagement</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Consultation and engagement details"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recomended_actions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recommended Actions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Recommended actions"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Screening Results</h3>
              
              <FormField
                control={form.control}
                name="screening_results.risk_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALTO">Alto Risco</SelectItem>
                        <SelectItem value="SUBSTANCIAL">Risco Substancial</SelectItem>
                        <SelectItem value="MODERADO">Risco Moderado</SelectItem>
                        <SelectItem value="BAIXO">Risco Baixo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="screening_results.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Screening results description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="screening_results.instruments_to_be_developed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instruments to be Developed</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Instruments to be developed"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {screening ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}