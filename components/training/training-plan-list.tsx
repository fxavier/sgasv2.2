"use client";

import { useState } from "react";
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
import { Pencil, Trash2, Search } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

// Mock data
const initialPlans = [
  {
    id: 1,
    updated_by: "John Doe",
    date: "2024-03-20",
    year: 2024,
    training_area: "Safety",
    training_title: "Workplace Safety Training",
    training_objective: "Ensure all staff understand safety protocols",
    training_type: "Internal",
    training_entity: "Safety Department",
    duration: "2 days",
    number_of_trainees: 25,
    training_recipients: "All staff members",
    training_month: "April",
    training_status: "Planned",
    observations: "Mandatory for all new employees",
  },
  {
    id: 2,
    updated_by: "Jane Smith",
    date: "2024-03-21",
    year: 2024,
    training_area: "Leadership",
    training_title: "Management Skills Workshop",
    training_objective: "Develop leadership capabilities",
    training_type: "External",
    training_entity: "Leadership Academy",
    duration: "3 days",
    number_of_trainees: 15,
    training_recipients: "Department managers",
    training_month: "June",
    training_status: "Completed",
    observations: "Follow-up session scheduled",
  },
] as TrainingPlan[];

interface TrainingPlanListProps {
  onEdit: (plan: TrainingPlan) => void;
}

const ITEMS_PER_PAGE = 5;

const getStatusColor = (status: string) => {
  return status === "Completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800";
};

const getTypeColor = (type: string) => {
  return type === "Internal" ? "bg-purple-100 text-purple-800" : "bg-orange-100 text-orange-800";
};

export function TrainingPlanList({ onEdit }: TrainingPlanListProps) {
  const [plans, setPlans] = useState<TrainingPlan[]>(initialPlans);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    setPlans(plans.filter(plan => plan.id !== id));
    setDeleteId(null);
    toast({
      title: "Training plan deleted",
      description: "The training plan has been successfully deleted.",
    });
  };

  // Filter plans based on search query
  const filteredPlans = plans.filter(plan =>
    plan.training_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.training_area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.updated_by.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredPlans.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPlans = filteredPlans.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search training plans..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Showing {Math.min(startIndex + 1, filteredPlans.length)} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredPlans.length)} of{" "}
            {filteredPlans.length} plans
          </span>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <div className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20%]">Title</TableHead>
                <TableHead className="w-[15%]">Area</TableHead>
                <TableHead className="w-[10%]">Type</TableHead>
                <TableHead className="w-[15%]">Month</TableHead>
                <TableHead className="w-[10%]">Status</TableHead>
                <TableHead className="w-[20%]">Recipients</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.training_title}</TableCell>
                  <TableCell>{plan.training_area}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTypeColor(plan.training_type)}>
                      {plan.training_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{plan.training_month}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(plan.training_status)}>
                      {plan.training_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="line-clamp-2">{plan.training_recipients}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(plan)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(plan.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the training plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}