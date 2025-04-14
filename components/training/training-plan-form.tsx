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

const formSchema = z.object({
  updated_by: z.string().min(2, "Name must be at least 2 characters"),
  date: z.string(),
  year: z.number().min(2000, "Year must be 2000 or later").max(2100, "Year must be 2100 or earlier"),
  training_area: z.string().min(2, "Training area must be at least 2 characters"),
  training_title: z.string().min(2, "Training title must be at least 2 characters"),
  training_objective: z.string().min(10, "Training objective must be at least 10 characters"),
  training_type: z.enum(['Internal', 'External']),
  training_entity: z.string().min(2, "Training entity must be at least 2 characters"),
  duration: z.string().min(2, "Duration must be at least 2 characters"),
  number_of_trainees: z.number().min(1, "Number of trainees must be at least 1"),
  training_recipients: z.string().min(2, "Training recipients must be at least 2 characters"),
  training_month: z.enum([
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]),
  training_status: z.enum(['Planned', 'Completed']),
  observations: z.string().optional(),
});

interface TrainingPlanFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: TrainingPlan | null;
  onClose: () => void;
}

export function TrainingPlanForm({
  open,
  onOpenChange,
  plan,
  onClose,
}: TrainingPlanFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      updated_by: plan?.updated_by || "",
      date: plan?.date || format(new Date(), "yyyy-MM-dd"),
      year: plan?.year || new Date().getFullYear(),
      training_area: plan?.training_area || "",
      training_title: plan?.training_title || "",
      training_objective: plan?.training_objective || "",
      training_type: plan?.training_type || "Internal",
      training_entity: plan?.training_entity || "",
      duration: plan?.duration || "",
      number_of_trainees: plan?.number_of_trainees || 1,
      training_recipients: plan?.training_recipients || "",
      training_month: plan?.training_month || "January",
      training_status: plan?.training_status || "Planned",
      observations: plan?.observations || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      
      toast({
        title: plan ? "Training plan updated" : "Training plan created",
        description: plan
          ? "The training plan has been successfully updated."
          : "The training plan has been successfully created.",
      });
      
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving the training plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>
            {plan ? "Edit Training Plan" : "Create Training Plan"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="updated_by"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Updated By</FormLabel>
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
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter year"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="training_area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Training Area</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter training area" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="training_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Training Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter training title" {...field} />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="training_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Training Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select training type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Internal">Internal</SelectItem>
                          <SelectItem value="External">External</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="training_entity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Training Entity</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter training entity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter duration" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="number_of_trainees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Trainees</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter number of trainees"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="training_recipients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Training Recipients</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter training recipients"
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
                  name="training_month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Training Month</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="January">January</SelectItem>
                          <SelectItem value="February">February</SelectItem>
                          <SelectItem value="March">March</SelectItem>
                          <SelectItem value="April">April</SelectItem>
                          <SelectItem value="May">May</SelectItem>
                          <SelectItem value="June">June</SelectItem>
                          <SelectItem value="July">July</SelectItem>
                          <SelectItem value="August">August</SelectItem>
                          <SelectItem value="September">September</SelectItem>
                          <SelectItem value="October">October</SelectItem>
                          <SelectItem value="November">November</SelectItem>
                          <SelectItem value="December">December</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="training_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Training Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Planned">Planned</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="observations"
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
            </form>
          </Form>
        </ScrollArea>
        <div className="flex justify-end gap-4 p-6 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            {plan ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}