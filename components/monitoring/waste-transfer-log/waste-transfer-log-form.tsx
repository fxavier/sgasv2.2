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
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  waste_type: z.string().min(2, "Waste type must be at least 2 characters"),
  how_is_waste_contained: z.string().min(2, "Containment method must be at least 2 characters"),
  how_much_waste: z.number().min(0, "Waste amount must be 0 or greater"),
  reference_number: z.string().min(2, "Reference number must be at least 2 characters"),
  date_of_removal: z.string(),
  transfer_company: z.string().min(2, "Transfer company must be at least 2 characters"),
  special_instructions: z.string(),
});

interface WasteTransferLogFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: WasteTransferLog | null;
  onClose: () => void;
}

export function WasteTransferLogForm({
  open,
  onOpenChange,
  log,
  onClose,
}: WasteTransferLogFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      waste_type: log?.waste_type || "",
      how_is_waste_contained: log?.how_is_waste_contained || "",
      how_much_waste: log?.how_much_waste || 0,
      reference_number: log?.reference_number || "",
      date_of_removal: log?.date_of_removal || format(new Date(), "yyyy-MM-dd"),
      transfer_company: log?.transfer_company || "",
      special_instructions: log?.special_instructions || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      
      toast({
        title: log ? "Log updated" : "Log created",
        description: log
          ? "The waste transfer log has been successfully updated."
          : "The waste transfer log has been successfully created.",
      });
      
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving the waste transfer log. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {log ? "Edit Waste Transfer Log" : "Create Waste Transfer Log"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="waste_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waste Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter waste type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="how_is_waste_contained"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Containment Method</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter containment method" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="how_much_waste"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waste Amount</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter waste amount"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reference_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter reference number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date_of_removal"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Removal</FormLabel>
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
                name="transfer_company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transfer Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter transfer company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="special_instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter special instructions"
                      className="min-h-[100px]"
                      {...field}
                    />
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
                {log ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}