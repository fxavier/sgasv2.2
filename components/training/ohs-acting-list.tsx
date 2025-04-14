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
const initialEntries = [
  {
    id: 1,
    fullname: "John Doe",
    designation: "Safety Officer",
    terms_of_office_from: "2024-01-01",
    terms_of_office_to: "2024-12-31",
    acceptance_confirmation: [
      { id: 1, description: "Attended OHS Training" },
      { id: 2, description: "Completed Safety Certification" },
    ],
    date: "2024-03-20",
  },
  {
    id: 2,
    fullname: "Jane Smith",
    designation: "Health Coordinator",
    terms_of_office_from: "2024-02-01",
    terms_of_office_to: "2025-01-31",
    acceptance_confirmation: [
      { id: 3, description: "Signed Safety Protocol Agreement" },
    ],
    date: "2024-03-21",
  },
] as OHSActing[];

interface OHSActingListProps {
  onEdit: (entry: OHSActing) => void;
}

const ITEMS_PER_PAGE = 5;

export function OHSActingList({ onEdit }: OHSActingListProps) {
  const [entries, setEntries] = useState<OHSActing[]>(initialEntries);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    setEntries(entries.filter(entry => entry.id !== id));
    setDeleteId(null);
    toast({
      title: "Entry deleted",
      description: "The OHS acting entry has been successfully deleted.",
    });
  };

  // Filter entries based on search query
  const filteredEntries = entries.filter(entry =>
    entry.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.designation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEntries = filteredEntries.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search entries..."
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
            Showing {Math.min(startIndex + 1, filteredEntries.length)} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredEntries.length)} of{" "}
            {filteredEntries.length} entries
          </span>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <div className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20%]">Full Name</TableHead>
                <TableHead className="w-[15%]">Designation</TableHead>
                <TableHead className="w-[15%]">Office From</TableHead>
                <TableHead className="w-[15%]">Office To</TableHead>
                <TableHead className="w-[25%]">Confirmations</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.fullname}</TableCell>
                  <TableCell>{entry.designation}</TableCell>
                  <TableCell>{entry.terms_of_office_from}</TableCell>
                  <TableCell>{entry.terms_of_office_to}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {entry.acceptance_confirmation.map((conf) => (
                        <Badge key={conf.id} variant="outline" className="bg-blue-100 text-blue-800">
                          {conf.description}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(entry)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(entry.id)}
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
              This action cannot be undone. This will permanently delete the OHS acting entry.
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