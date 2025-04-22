"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Search, Loader2, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";

// Define the AcceptanceConfirmation interface if not already defined
interface AcceptanceConfirmation {
  id?: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

const formSchema = z.object({
  description: z.string().min(5, "Description must be at least 5 characters"),
});

export default function AcceptanceConfirmationPage() {
  const [confirmations, setConfirmations] = useState<AcceptanceConfirmation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingConfirmation, setEditingConfirmation] = useState<AcceptanceConfirmation | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  // Fetch confirmations
  const fetchConfirmations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/acceptance-confirmations');
      if (!response.ok) {
        throw new Error('Failed to fetch acceptance confirmations');
      }
      const data = await response.json();
      setConfirmations(data);
    } catch (error) {
      console.error('Error fetching confirmations:', error);
      toast({
        title: "Error",
        description: "Failed to load acceptance confirmations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfirmations();
  }, []);

  // Update form when editing a confirmation
  useEffect(() => {
    if (editingConfirmation) {
      form.reset({
        description: editingConfirmation.description,
      });
    } else {
      form.reset({
        description: "",
      });
    }
  }, [editingConfirmation, form]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/acceptance-confirmations/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete confirmation');
      }
      
      setConfirmations(confirmations.filter(confirmation => confirmation.id !== id));
      toast({
        title: "Confirmation deleted",
        description: "The acceptance confirmation has been successfully deleted.",
      });
    } catch (error: any) {
      console.error('Error deleting confirmation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete confirmation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (editingConfirmation) {
        // Update existing confirmation
        const response = await fetch(`/api/acceptance-confirmations/${editingConfirmation.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update confirmation');
        }
        
        toast({
          title: "Confirmation updated",
          description: "The acceptance confirmation has been successfully updated.",
        });
      } else {
        // Create new confirmation
        const response = await fetch('/api/acceptance-confirmations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create confirmation');
        }
        
        toast({
          title: "Confirmation created",
          description: "The acceptance confirmation has been successfully created.",
        });
      }
      
      // Refresh the list
      fetchConfirmations();
      
      // Close the form and reset
      setIsFormOpen(false);
      setEditingConfirmation(null);
      form.reset();
    } catch (error) {
      console.error('Error saving confirmation:', error);
      toast({
        title: "Error",
        description: "There was an error saving the confirmation. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter confirmations based on search query
  const filteredConfirmations = confirmations.filter(
    (confirmation) => confirmation.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Acceptance Confirmation</h1>
          <p className="text-gray-500 mt-2">Manage acceptance confirmations for OHS activities</p>
        </div>
        <Button 
          onClick={() => {
            setEditingConfirmation(null);
            setIsFormOpen(true);
          }} 
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add Confirmation
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search confirmations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <div className="min-w-full">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading confirmations...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70%]">Description</TableHead>
                  <TableHead className="w-[15%]">Created At</TableHead>
                  <TableHead className="w-[15%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConfirmations.length > 0 ? (
                  filteredConfirmations.map((confirmation) => (
                    <TableRow key={confirmation.id}>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                          {confirmation.description}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(confirmation.createdAt!).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setEditingConfirmation(confirmation);
                              setIsFormOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(confirmation.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                      No confirmations found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Confirmation Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingConfirmation ? "Edit Acceptance Confirmation" : "Add Acceptance Confirmation"}
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
                      <Textarea 
                        placeholder="Enter confirmation description" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingConfirmation(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingConfirmation ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => !isDeleting && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this acceptance confirmation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}