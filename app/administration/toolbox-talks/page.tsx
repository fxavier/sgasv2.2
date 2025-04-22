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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export default function ToolboxTalksPage() {
  const [toolboxTalks, setToolboxTalks] = useState<ToolBoxTalks[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTalk, setEditingTalk] = useState<ToolBoxTalks | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // Fetch toolbox talks
  const fetchToolboxTalks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/toolbox-talks');
      if (!response.ok) {
        throw new Error('Failed to fetch toolbox talks');
      }
      const data = await response.json();
      setToolboxTalks(data);
    } catch (error) {
      console.error('Error fetching toolbox talks:', error);
      toast({
        title: "Error",
        description: "Failed to load toolbox talks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchToolboxTalks();
  }, []);

  // Update form when editing a toolbox talk
  useEffect(() => {
    if (editingTalk) {
      form.reset({
        name: editingTalk.name,
      });
    } else {
      form.reset({
        name: "",
      });
    }
  }, [editingTalk, form]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      // In a real app, you would call an API endpoint to delete the toolbox talk
      // For now, we'll just simulate it
      setToolboxTalks(toolboxTalks.filter(talk => talk.id !== id));
      toast({
        title: "Toolbox talk deleted",
        description: "The toolbox talk has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting toolbox talk:', error);
      toast({
        title: "Error",
        description: "Failed to delete toolbox talk. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (editingTalk) {
        // Update existing toolbox talk (mock)
        setToolboxTalks(toolboxTalks.map(talk => 
          talk.id === editingTalk.id ? { ...talk, name: values.name } : talk
        ));
        
        toast({
          title: "Toolbox talk updated",
          description: "The toolbox talk has been successfully updated.",
        });
      } else {
        // Create new toolbox talk
        const response = await fetch('/api/toolbox-talks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create toolbox talk');
        }
        
        // Refresh the list
        fetchToolboxTalks();
        
        toast({
          title: "Toolbox talk created",
          description: "The toolbox talk has been successfully created.",
        });
      }
      
      // Close the form and reset
      setIsFormOpen(false);
      setEditingTalk(null);
      form.reset();
    } catch (error) {
      console.error('Error saving toolbox talk:', error);
      toast({
        title: "Error",
        description: "There was an error saving the toolbox talk. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter toolbox talks based on search query
  const filteredTalks = toolboxTalks.filter(
    (talk) => talk.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Toolbox Talks Management</h1>
          <p className="text-gray-500 mt-2">Manage toolbox talks for training</p>
        </div>
        <Button 
          onClick={() => {
            setEditingTalk(null);
            setIsFormOpen(true);
          }} 
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add Toolbox Talk
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search toolbox talks..."
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
              <span className="ml-2">Loading toolbox talks...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70%]">Name</TableHead>
                  <TableHead className="w-[30%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTalks.length > 0 ? (
                  filteredTalks.map((talk) => (
                    <TableRow key={talk.id}>
                      <TableCell className="font-medium">{talk.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setEditingTalk(talk);
                              setIsFormOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(talk.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8 text-gray-500">
                      No toolbox talks found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Toolbox Talk Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingTalk ? "Edit Toolbox Talk" : "Create Toolbox Talk"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter toolbox talk name" {...field} />
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
                    setEditingTalk(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTalk ? "Update" : "Create"}
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
              This action cannot be undone. This will permanently delete the toolbox talk.
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