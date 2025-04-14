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
const initialWaste = [
  {
    id: 1,
    waste_route: "Recycling Center",
    labelling: "Recyclable Materials",
    storage: "Dedicated Storage Area B",
    transportation_company_method: "EcoTransport - Weekly Collection",
    disposal_company: "Green Recycling Co",
    special_instructions: "Separate plastics and paper",
    created_at: "2024-03-20",
  },
  {
    id: 2,
    waste_route: "Hazardous Waste Facility",
    labelling: "Chemical Waste",
    storage: "Secure Storage Unit A",
    transportation_company_method: "SafeWaste Transport - Monthly Collection",
    disposal_company: "Industrial Waste Solutions",
    special_instructions: "Handle with protective equipment",
    created_at: "2024-03-21",
  },
] as WasteManagement[];

interface WasteManagementListProps {
  onEdit: (waste: WasteManagement) => void;
}

const ITEMS_PER_PAGE = 5;

export function WasteManagementList({ onEdit }: WasteManagementListProps) {
  const [waste, setWaste] = useState<WasteManagement[]>(initialWaste);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    setWaste(waste.filter(w => w.id !== id));
    setDeleteId(null);
    toast({
      title: "Record deleted",
      description: "The waste management record has been successfully deleted.",
    });
  };

  // Filter waste based on search query
  const filteredWaste = waste.filter(w =>
    w.waste_route.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.labelling.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.disposal_company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredWaste.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedWaste = filteredWaste.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search waste management..."
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
            Showing {Math.min(startIndex + 1, filteredWaste.length)} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredWaste.length)} of{" "}
            {filteredWaste.length} records
          </span>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <div className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%]">Waste Route</TableHead>
                <TableHead className="w-[15%]">Labelling</TableHead>
                <TableHead className="w-[15%]">Storage</TableHead>
                <TableHead className="w-[20%]">Transportation</TableHead>
                <TableHead className="w-[15%]">Disposal Company</TableHead>
                <TableHead className="w-[10%]">Created</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedWaste.map((w) => (
                <TableRow key={w.id}>
                  <TableCell className="font-medium">{w.waste_route}</TableCell>
                  <TableCell>{w.labelling}</TableCell>
                  <TableCell>{w.storage}</TableCell>
                  <TableCell>{w.transportation_company_method}</TableCell>
                  <TableCell>{w.disposal_company}</TableCell>
                  <TableCell>{new Date(w.created_at!).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(w)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(w.id)}
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
              This action cannot be undone. This will permanently delete the waste management record.
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