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

// Mock data for dropdowns
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

const formSchema = z.object({
  filled_by: z.string().min(2, "Name must be at least 2 characters"),
  date: z.string(),
  department: z.object({
    id: z.number(),
    name: z.string(),
  }).optional(),
  subproject: z.object({
    id: z.number(),
    name: z.string(),
  }).optional(),
  training: z.string().min(2, "Training must be at least 2 characters"),
  training_objective: z.string().min(10, "Training objective must be at least 10 characters"),
  proposal_of_training_entity: z.string().min(2, "Training entity must be at least 2 characters"),
  potential_training_participants: z.string().min(2, "Participants must be at least 2 characters"),
});

interface TrainingNeedsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  need: TrainingNeeds | null;
  onClose: () => void;
}

export function TrainingNeedsForm({
  open,
  onOpenChange,
  need,
  onClose,
}: TrainingNeedsFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      filled_by: need?.filled_by || "",
      date: need?.date || format(new Date(), "yyyy-MM-dd"),
      department: need?.department,
      subproject: need?.subproject,
      training: need?.training || "",
      training_objective: need?.training_objective || "",
      proposal_of_training_entity: need?.proposal_of_training_entity || "",
      potential_training_participants: need?.potential_training_participants || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      
      toast({
        title: need ? "Training need updated" : "Training need created",
        description: need
          ? "The training need has been successfully updated."
          : "The training need has been successfully created.",
      });
      
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving the training need. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>
            {need ? "Edit Training Need" : "Create Training Need"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="filled_by"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Filled By</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

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

              <FormField
                control={form.control}
                name="training_objective"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Training Objective</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter training objective"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="proposal_of_training_entity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proposed Training Entity</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter proposed training entity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="potential_training_participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potential Training Participants</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter potential participants"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        <div className="flex justify-end gap-4 p-6 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            {need ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}