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
const mockAcceptanceConfirmations = [
  { id: 1, description: "Attended OHS Training" },
  { id: 2, description: "Completed Safety Certification" },
  { id: 3, description: "Signed Safety Protocol Agreement" },
];

const formSchema = z.object({
  fullname: z.string().min(2, "Full name must be at least 2 characters"),
  designation: z.string().optional(),
  terms_of_office_from: z.string().optional(),
  terms_of_office_to: z.string().optional(),
  acceptance_confirmation: z.array(z.object({
    id: z.number(),
    description: z.string(),
  })),
  date: z.string(),
});

interface OHSActingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: OHSActing | null;
  onClose: () => void;
}

export function OHSActingForm({
  open,
  onOpenChange,
  entry,
  onClose,
}: OHSActingFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: entry?.fullname || "",
      designation: entry?.designation || "",
      terms_of_office_from: entry?.terms_of_office_from || "",
      terms_of_office_to: entry?.terms_of_office_to || "",
      acceptance_confirmation: entry?.acceptance_confirmation || [],
      date: entry?.date || format(new Date(), "yyyy-MM-dd"),
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      
      toast({
        title: entry ? "Entry updated" : "Entry created",
        description: entry
          ? "The OHS acting entry has been successfully updated."
          : "The OHS acting entry has been successfully created.",
      });
      
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving the OHS acting entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {entry ? "Edit OHS Acting Entry" : "Create OHS Acting Entry"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter designation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="terms_of_office_from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terms of Office From</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter start date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terms_of_office_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terms of Office To</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter end date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="acceptance_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Acceptance Confirmation</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const selected = mockAcceptanceConfirmations.find(
                        (conf) => conf.id === parseInt(value)
                      );
                      field.onChange(selected ? [selected] : []);
                    }}
                    value={field.value[0]?.id?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select confirmation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockAcceptanceConfirmations.map((conf) => (
                        <SelectItem key={conf.id} value={conf.id.toString()}>
                          {conf.description}
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

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {entry ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}