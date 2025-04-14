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

// Mock data
const mockDepartments = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "HR" },
  { id: 3, name: "Operations" },
];

const mockSubprojects = [
  { id: 1, name: "Project Alpha" },
  { id: 2, name: "Project Beta" },
  { id: 3, name: "Project Gamma" },
];

const mockEvaluationQuestions = [
  { id: 1, question: "After the training, has the employee demonstrated greater knowledge related to their work?" },
  { id: 2, question: "Was the employee able to put the knowledge obtained in the training into practice?" },
  { id: 3, question: "Were working conditions provided to the employee to apply the knowledge acquired in the training?" },
  { id: 4, question: "Did the training achieve its objectives?" },
  { id: 5, question: "What result was obtained after the training? (Justify by indicating the employee results, comparing before and after)" },
];

const formSchema = z.object({
  training: z.string().min(2, "Training must be at least 2 characters"),
  date: z.string(),
  department: z.object({
    id: z.number(),
    name: z.string(),
  }).optional(),
  subproject: z.object({
    id: z.number(),
    name: z.string(),
  }).optional(),
  trainee: z.string().min(2, "Trainee name must be at least 2 characters"),
  immediate_supervisor: z.string().min(2, "Supervisor name must be at least 2 characters"),
  training_evaluation_question: z.object({
    id: z.number(),
    question: z.string(),
  }),
  answer: z.enum(['Satisfactory', 'Partially Satisfactory', 'Unsatisfactory']),
  human_resource_evaluation: z.enum(['effective', 'ineffective']),
});

interface TrainingEffectivenessFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessment: TrainingEffectivnessAssessment | null;
  onClose: () => void;
}

export function TrainingEffectivenessAssessmentForm({
  open,
  onOpenChange,
  assessment,
  onClose,
}: TrainingEffectivenessFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      training: assessment?.training || "",
      date: assessment?.date || format(new Date(), "yyyy-MM-dd"),
      department: assessment?.department,
      subproject: assessment?.subproject,
      trainee: assessment?.trainee || "",
      immediate_supervisor: assessment?.immediate_supervisor || "",
      training_evaluation_question: assessment?.training_evaluation_question || mockEvaluationQuestions[0],
      answer: assessment?.answer || "Satisfactory",
      human_resource_evaluation: assessment?.human_resource_evaluation || "effective",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      
      toast({
        title: assessment ? "Assessment updated" : "Assessment created",
        description: assessment
          ? "The training effectiveness assessment has been successfully updated."
          : "The training effectiveness assessment has been successfully created.",
      });
      
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving the assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {assessment ? "Edit Training Effectiveness Assessment" : "Create Training Effectiveness Assessment"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="training"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Training</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter training name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
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
                name="department"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="trainee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trainee</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter trainee name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="immediate_supervisor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Immediate Supervisor</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter supervisor name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="training_evaluation_question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evaluation Question</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const selected = mockEvaluationQuestions.find(
                        (q) => q.id === parseInt(value)
                      );
                      field.onChange(selected);
                    }}
                    value={field.value?.id?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select question" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockEvaluationQuestions.map((q) => (
                        <SelectItem key={q.id} value={q.id.toString()}>
                          {q.question}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select answer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Satisfactory">Satisfactory</SelectItem>
                        <SelectItem value="Partially Satisfactory">Partially Satisfactory</SelectItem>
                        <SelectItem value="Unsatisfactory">Unsatisfactory</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="human_resource_evaluation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HR Evaluation</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select evaluation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="effective">Effective</SelectItem>
                        <SelectItem value="ineffective">Ineffective</SelectItem>
                      </SelectContent>
                    </Select>
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
                {assessment ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}