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
const initialCompliances = [
  {
    id: 1,
    number: "NC-2024-001",
    department: { id: 1, name: "Engineering" },
    non_compliance_description: "Safety protocol violation during maintenance",
    responsible_person: "John Doe",
    deadline: "2024-06-30",
    status: "PENDING",
    effectiveness_evaluation: "NOT_EFFECTIVE",
    created_at: "2024-03-20",
  },
  {
    id: 2,
    number: "NC-2024-002",
    department: { id: 2, name: "Operations" },
    non_compliance_description: "Environmental regulation breach in waste disposal",
    responsible_person: "Jane Smith",
    deadline: "2024-05-15",
    status: "IN_PROGRESS",
    effectiveness_evaluation: "EFFECTIVE",
    created_at: "2024-03-21",
  },
] as NonComplianceControl[];

interface NonComplianceListProps {
  onEdit: (compliance: NonComplianceControl) => void;
}

const ITEMS_PER_PAGE = 5;

const getStatusColor = (status: string) => {
  const colors = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'IN_PROGRESS': 'bg-blue-100 text-blue-800',
    'COMPLETED': 'bg-green-100 text-green-800',
  };
  return colors[status as keyof typeof colors] || colors.PENDING;
};

const getEffectivenessColor = (effectiveness: string) => {
  return effectiveness === 'EFFECTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
};

export function NonComplianceList({ onEdit }: NonComplianceListProps) {
  const [compliances, setCompliances] = useState<NonComplianceControl[]>(initialCompliances);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    setCompliances(compliances.filter(compliance => compliance.id !== id));
    setDeleteId(null);
    toast({
      title: "Non-compliance deleted",
      description: "The non-compliance record has been successfully deleted.",
    });
  };

  // Filter compliances based on search query
  const filteredCompliances = compliances.filter(compliance =>
    compliance.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    compliance.non_compliance_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    compliance.responsible_person.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredCompliances.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCompliances = filteredCompliances.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search non-compliances..."
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
            Showing {Math.min(startIndex + 1, filteredCompliances.length)} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredCompliances.length)} of{" "}
            {filteredCompliances.length} records
          </span>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <div className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%]">Number</TableHead>
                <TableHead className="w-[15%]">Department</TableHead>
                <TableHead className="w-[25%]">Description</TableHead>
                <TableHead className="w-[15%]">Responsible</TableHead>
                <TableHead className="w-[10%]">Status</TableHead>
                <TableHead className="w-[10%]">Effectiveness</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCompliances.map((compliance) => (
                <TableRow key={compliance.id}>
                  <TableCell className="font-medium">{compliance.number}</TableCell>
                  <TableCell>{compliance.department?.name}</TableCell>
                  <TableCell>
                    <div className="line-clamp-2">{compliance.non_compliance_description}</div>
                  </TableCell>
                  <TableCell>{compliance.responsible_person}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(compliance.status)}>
                      {compliance.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getEffectivenessColor(compliance.effectiveness_evaluation)}>
                      {compliance.effectiveness_evaluation === 'EFFECTIVE' ? 'Effective' : 'Not Effective'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(compliance)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(compliance.id)}
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
              This action cannot be undone. This will permanently delete the non-compliance record.
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