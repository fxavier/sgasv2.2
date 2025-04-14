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
const initialGrievances = [
  {
    id: 1,
    name: "John Smith",
    company: "Construction Co Ltd",
    date: "2024-03-20",
    prefered_contact_method: "EMAIL",
    contact: "john.smith@example.com",
    prefered_language: "ENGLISH",
    grievance_details: "Safety equipment concerns",
    unique_identification_of_company_acknowlegement: "GR-2024-001",
    name_of_person_acknowledging_grievance: "Jane Wilson",
    position_of_person_acknowledging_grievance: "HR Manager",
    date_of_acknowledgement: "2024-03-21",
  },
  {
    id: 2,
    name: "Maria Garcia",
    company: "Maintenance Services Inc",
    date: "2024-03-21",
    prefered_contact_method: "PHONE",
    contact: "+1234567890",
    prefered_language: "PORTUGUESE",
    grievance_details: "Working hours dispute",
    unique_identification_of_company_acknowlegement: "GR-2024-002",
    name_of_person_acknowledging_grievance: "Robert Brown",
    position_of_person_acknowledging_grievance: "Operations Manager",
    date_of_acknowledgement: "2024-03-22",
  },
] as WorkerGrievance[];

interface WorkerGrievanceListProps {
  onEdit: (grievance: WorkerGrievance) => void;
}

const ITEMS_PER_PAGE = 5;

const getContactMethodColor = (method: string) => {
  const colors = {
    'EMAIL': 'bg-blue-100 text-blue-800',
    'PHONE': 'bg-green-100 text-green-800',
    'FACE_TO_FACE': 'bg-purple-100 text-purple-800',
  };
  return colors[method as keyof typeof colors] || colors.EMAIL;
};

const getLanguageColor = (language: string) => {
  const colors = {
    'PORTUGUESE': 'bg-yellow-100 text-yellow-800',
    'ENGLISH': 'bg-blue-100 text-blue-800',
    'OTHER': 'bg-gray-100 text-gray-800',
  };
  return colors[language as keyof typeof colors] || colors.OTHER;
};

export function WorkerGrievanceList({ onEdit }: WorkerGrievanceListProps) {
  const [grievances, setGrievances] = useState<WorkerGrievance[]>(initialGrievances);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    setGrievances(grievances.filter(grievance => grievance.id !== id));
    setDeleteId(null);
    toast({
      title: "Grievance deleted",
      description: "The worker grievance has been successfully deleted.",
    });
  };

  // Filter grievances based on search query
  const filteredGrievances = grievances.filter(grievance =>
    grievance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    grievance.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    grievance.grievance_details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredGrievances.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedGrievances = filteredGrievances.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search grievances..."
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
            Showing {Math.min(startIndex + 1, filteredGrievances.length)} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredGrievances.length)} of{" "}
            {filteredGrievances.length} grievances
          </span>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <div className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%]">Name</TableHead>
                <TableHead className="w-[15%]">Company</TableHead>
                <TableHead className="w-[25%]">Details</TableHead>
                <TableHead className="w-[15%]">Contact Method</TableHead>
                <TableHead className="w-[10%]">Language</TableHead>
                <TableHead className="w-[10%]">Date</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedGrievances.map((grievance) => (
                <TableRow key={grievance.id}>
                  <TableCell className="font-medium">{grievance.name}</TableCell>
                  <TableCell>{grievance.company}</TableCell>
                  <TableCell>
                    <div className="line-clamp-2">{grievance.grievance_details}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getContactMethodColor(grievance.prefered_contact_method)}>
                      {grievance.prefered_contact_method.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getLanguageColor(grievance.prefered_language)}>
                      {grievance.prefered_language}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(grievance.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(grievance)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(grievance.id)}
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
              This action cannot be undone. This will permanently delete the worker grievance.
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