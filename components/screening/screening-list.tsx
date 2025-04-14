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
const initialScreenings = [
  {
    id: 1,
    responsible_for_filling_form: { id: 1, name: "John Doe" },
    responsible_for_verification: { id: 2, name: "Jane Smith" },
    subproject: { id: 1, name: "Project Alpha" },
    biodiversidade_recursos_naturais: { id: 1, description: "Flora" },
    response: "SIM",
    comment: "Initial assessment completed",
    screening_results: {
      risk_category: "BAIXO",
      description: "Low environmental impact",
      instruments_to_be_developed: "Standard monitoring tools",
    },
    created_at: "2024-03-20",
  },
  {
    id: 2,
    responsible_for_filling_form: { id: 2, name: "Jane Smith" },
    responsible_for_verification: { id: 1, name: "John Doe" },
    subproject: { id: 2, name: "Project Beta" },
    biodiversidade_recursos_naturais: { id: 2, description: "Fauna" },
    response: "NAO",
    comment: "Requires further assessment",
    screening_results: {
      risk_category: "ALTO",
      description: "Significant environmental concerns",
      instruments_to_be_developed: "Detailed monitoring plan",
    },
    created_at: "2024-03-21",
  },
] as EnvironmentalSocialScreening[];

interface ScreeningListProps {
  onEdit: (screening: EnvironmentalSocialScreening) => void;
}

const ITEMS_PER_PAGE = 5;

const getRiskCategoryColor = (category: string) => {
  const colors = {
    ALTO: "bg-red-100 text-red-800",
    SUBSTANCIAL: "bg-orange-100 text-orange-800",
    MODERADO: "bg-yellow-100 text-yellow-800",
    BAIXO: "bg-green-100 text-green-800",
  };
  return colors[category as keyof typeof colors] || colors.BAIXO;
};

export function ScreeningList({ onEdit }: ScreeningListProps) {
  const [screenings, setScreenings] = useState<EnvironmentalSocialScreening[]>(initialScreenings);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    setScreenings(screenings.filter(screening => screening.id !== id));
    setDeleteId(null);
    toast({
      title: "Screening deleted",
      description: "The screening form has been successfully deleted.",
    });
  };

  // Filter screenings based on search query
  const filteredScreenings = screenings.filter(screening =>
    screening.subproject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    screening.responsible_for_filling_form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    screening.biodiversidade_recursos_naturais.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredScreenings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedScreenings = filteredScreenings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search screenings..."
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
            Showing {Math.min(startIndex + 1, filteredScreenings.length)} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredScreenings.length)} of{" "}
            {filteredScreenings.length} screenings
          </span>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <div className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20%]">Subproject</TableHead>
                <TableHead className="w-[15%]">Responsible</TableHead>
                <TableHead className="w-[15%]">Biodiversidade</TableHead>
                <TableHead className="w-[10%]">Response</TableHead>
                <TableHead className="w-[15%]">Risk Category</TableHead>
                <TableHead className="w-[15%]">Created At</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedScreenings.map((screening) => (
                <TableRow key={screening.id}>
                  <TableCell className="font-medium">{screening.subproject.name}</TableCell>
                  <TableCell>{screening.responsible_for_filling_form.name}</TableCell>
                  <TableCell>{screening.biodiversidade_recursos_naturais.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={screening.response === 'SIM' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {screening.response}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getRiskCategoryColor(screening.screening_results.risk_category)}>
                      {screening.screening_results.risk_category}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(screening.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(screening)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(screening.id)}
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
              This action cannot be undone. This will permanently delete the screening form.
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