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

const formSchema = z.object({
  description: z.string().min(2, "Description must be at least 2 characters"),
  goals: z.string().min(2, "Goals must be at least 2 characters"),
  strategies_for_achievement: z.string().min(10, "Strategies must be at least 10 characters"),
});

interface StrategicObjectiveFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  objective: StrategicObjective | null;
  onClose: () => void;
}

export function StrategicObjectiveForm({
  open,
  onOpenChange,
  objective,
  onClose,
}: StrategicObjectiveFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: objective?.description || "",
      goals: objective?.goals || "",
      strategies_for_achievement: objective?.strategies_for_achievement || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      
      toast({
        title: objective ? "Objective updated" : "Objective created",
        description: objective
          ? "The strategic objective has been successfully updated."
          : "The strategic objective has been successfully created.",
      });
      
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving the strategic objective. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {objective ? "Edit Strategic Objective" : "Create Strategic Objective"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goals</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter goals" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="strategies_for_achievement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strategies for Achievement</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe strategies for achievement"
                      className="resize-none"
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
                {objective ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}