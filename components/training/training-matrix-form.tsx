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

// Mock data
const mockPositions = [
  { id: 1, name: "Project Manager" },
  { id: 2, name: "Safety Officer" },
  { id: 3, name: "Site Engineer" },
];

const mockTrainings = [
  { id: 1, name: "Safety Protocols" },
  { id: 2, name: "Risk Assessment" },
  { id: 3, name: "Emergency Response" },
];

const mockToolboxTalks = [
  { id: 1, name: "Daily Safety Briefing" },
  { id: 2, name: "Equipment Operation" },
  { id: 3, name: "Hazard Identification" },
];

const formSchema = z.object({
  date: z.string(),
  position: z.object({
    id: z.number(),
    name: z.string(),
  }),
  training: z.object({
    id: z.number(),
    name: z.string(),
  }),
  toolbox_talks: z.object({
    id: z.number(),
    name: z.string(),
  }),
  effectiveness: z.enum(['Effective', 'Not effective']),
  actions_training_not_effective: z.string().optional(),
  approved_by: z.string().min(2, "Approver name must be at least 2 characters"),
});

interface TrainingMatrixFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matrix: TrainingMatrix | null;
  onClose: () => void;
}

export function TrainingMatrixForm({
  open,
  onOpenChange,
  matrix,
  onClose,
}: TrainingMatrixFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: matrix?.date || format(new Date(), "yyyy-MM-dd"),
      position: matrix?.position || mockPositions[0],
      training: matrix?.training || mockTrainings[0],
      toolbox_talks: matrix?.toolbox_talks || mockToolboxTalks[0],
      effectiveness: matrix?.effectiveness || "Effective",
      actions_training_not_effective: matrix?.actions_training_not_effective || "",
      approved_by: matrix?.approved_by || "",
    },
  });

  const effectiveness = form.watch('effectiveness');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      
      toast({
        title: matrix ? "Matrix updated" : "Matrix created",
        description: matrix
          ? "The training matrix has been successfully updated."
          : "The training matrix has been successfully created.",
      });
      
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving the training matrix. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {matrix ? "Edit Training Matrix" : "Create Training Matrix"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const selected = mockPositions.find(
                        (pos) => pos.id === parseInt(value)
                      );
                      field.onChange(selected);
                    }}
                    value={field.value?.id?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockPositions.map((pos) => (
                        <SelectItem key={pos.id} value={pos.id.toString()}>
                          {pos.name}
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
              name="training"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Training</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const selected = mockTrainings.find(
                        (t) => t.id === parseInt(value)
                      );
                      field.onChange(selected);
                    }}
                    value={field.value?.id?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select training" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockTrainings.map((t) => (
                        <SelectItem key={t.id} value={t.id.toString()}>
                          {t.name}
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
              name="toolbox_talks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Toolbox Talks</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const selected = mockToolboxTalks.find(
                        (t) => t.id === parseInt(value)
                      );
                      field.onChange(selected);
                    }}
                    value={field.value?.id?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select toolbox talk" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockToolboxTalks.map((t) => (
                        <SelectItem key={t.id} value={t.id.toString()}>
                          {t.name}
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
              name="effectiveness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Effectiveness</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select effectiveness" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Effective">Effective</SelectItem>
                      <SelectItem value="Not effective">Not effective</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {effectiveness === 'Not effective' && (
              <FormField
                control={form.control}
                name="actions_training_not_effective"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actions for Not Effective Training</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe actions to be taken"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="approved_by"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Approved By</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter approver name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {matrix ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}