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

// Mock data
const initialObjectives = [
  {
    id: 1,
    strategic_objective: "Increase market share",
    specific_objective: "Expand into Asian markets",
    actions_for_achievement: "Establish partnerships with local distributors",
    responsible_person: "John Doe",
    necessary_resources: "Marketing budget, Local team",
    indicator: "Market penetration rate",
    goal: "15% market share in key Asian markets",
    monitoring_frequency: "Monthly",
    deadline: "2024-12-31",
    observation: "Focus on Japan and South Korea initially",
    created_at: "2024-03-20",
  },
  {
    id: 2,
    strategic_objective: "Improve customer satisfaction",
    specific_objective: "Reduce response time",
    actions_for_achievement: "Implement new customer service system",
    responsible_person: "Jane Smith",
    necessary_resources: "CRM System, Training",
    indicator: "Average response time",
    goal: "< 2 hours response time",
    monitoring_frequency: "Weekly",
    deadline: "2024-06-30",
    observation: "Integration with existing systems required",
    created_at: "2024-03-21",
  },
] as SpecificObjective[];

interface SpecificObjectiveListProps {
  onEdit: (objective: SpecificObjective) => void;
}

const ITEMS_PER_PAGE = 5;

export function SpecificObjectiveList({ onEdit }: SpecificObjectiveListProps) {
  const [objectives, setObjectives] = useState<SpecificObjective[]>(initialObjectives);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    setObjectives(objectives.filter(obj => obj.id !== id));
    setDeleteId(null);
    toast({
      title: "Objective deleted",
      description: "The specific objective has been successfully deleted.",
    });
  };

  // Filter objectives based on search query
  const filteredObjectives = objectives.filter(obj =>
    obj.strategic_objective.toLowerCase().includes(searchQuery.toLowerCase()) ||
    obj.specific_objective.toLowerCase().includes(searchQuery.toLowerCase()) ||
    obj.responsible_person.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredObjectives.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedObjectives = filteredObjectives.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search objectives..."
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
            Showing {Math.min(startIndex + 1, filteredObjectives.length)} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredObjectives.length)} of{" "}
            {filteredObjectives.length} objectives
          </span>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <div className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20%]">Strategic Objective</TableHead>
                <TableHead className="w-[20%]">Specific Objective</TableHead>
                <TableHead className="w-[15%]">Responsible</TableHead>
                <TableHead className="w-[15%]">Goal</TableHead>
                <TableHead className="w-[15%]">Deadline</TableHead>
                <TableHead className="w-[15%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedObjectives.map((objective) => (
                <TableRow key={objective.id}>
                  <TableCell className="font-medium">{objective.strategic_objective}</TableCell>
                  <TableCell>{objective.specific_objective}</TableCell>
                  <TableCell>{objective.responsible_person}</TableCell>
                  <TableCell>
                    <div className="line-clamp-2">{objective.goal}</div>
                  </TableCell>
                  <TableCell>{new Date(objective.deadline).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(objective)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(objective.id)}
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
              This action cannot be undone. This will permanently delete the specific objective.
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