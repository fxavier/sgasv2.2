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
const initialMatrix = [
  {
    id: 1,
    date: "2024-03-20",
    position: { id: 1, name: "Project Manager" },
    training: { id: 1, name: "Safety Protocols" },
    toolbox_talks: { id: 1, name: "Daily Safety Briefing" },
    effectiveness: "Effective",
    approved_by: "John Doe",
  },
  {
    id: 2,
    date: "2024-03-21",
    position: { id: 2, name: "Safety Officer" },
    training: { id: 2, name: "Risk Assessment" },
    toolbox_talks: { id: 2, name: "Equipment Operation" },
    effectiveness: "Not effective",
    actions_training_not_effective: "Additional training sessions required",
    approved_by: "Jane Smith",
  },
] as TrainingMatrix[];

interface TrainingMatrixListProps {
  onEdit: (matrix: TrainingMatrix) => void;
}

const ITEMS_PER_PAGE = 5;

const getEffectivenessColor = (effectiveness: string) => {
  return effectiveness === 'Effective' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
};

export function TrainingMatrixList({ onEdit }: TrainingMatrixListProps) {
  const [matrix, setMatrix] = useState<TrainingMatrix[]>(initialMatrix);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    setMatrix(matrix.filter(m => m.id !== id));
    setDeleteId(null);
    toast({
      title: "Matrix entry deleted",
      description: "The training matrix entry has been successfully deleted.",
    });
  };

  // Filter matrix based on search query
  const filteredMatrix = matrix.filter(m =>
    m.position.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.training.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.toolbox_talks.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredMatrix.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMatrix = filteredMatrix.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search matrix..."
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
            Showing {Math.min(startIndex + 1, filteredMatrix.length)} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredMatrix.length)} of{" "}
            {filteredMatrix.length} entries
          </span>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <div className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%]">Position</TableHead>
                <TableHead className="w-[20%]">Training</TableHead>
                <TableHead className="w-[20%]">Toolbox Talks</TableHead>
                <TableHead className="w-[10%]">Effectiveness</TableHead>
                <TableHead className="w-[15%]">Approved By</TableHead>
                <TableHead className="w-[10%]">Date</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMatrix.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.position.name}</TableCell>
                  <TableCell>{m.training.name}</TableCell>
                  <TableCell>{m.toolbox_talks.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getEffectivenessColor(m.effectiveness)}>
                      {m.effectiveness}
                    </Badge>
                  </TableCell>
                  <TableCell>{m.approved_by}</TableCell>
                  <TableCell>{new Date(m.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(m)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(m.id)}
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
              This action cannot be undone. This will permanently delete the training matrix entry.
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