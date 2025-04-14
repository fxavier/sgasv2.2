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
const initialForms = [
  {
    id: 1,
    activity_name: "Eco Tourism Resort",
    activity_type: "TURISTICA",
    development_stage: "NOVA",
    address: "Coastal Road, 123",
    email: "contact@ecoresort.com",
    activity_location: "Beach Front",
    activity_city: "Maputo",
    activity_province: "MAPUTO",
    insertion_point: "RURAL",
    territorial_planning_framework: "SERVICOS",
    total_investment_value: 1500000,
    created_at: "2024-03-20",
  },
  {
    id: 2,
    activity_name: "Solar Power Plant",
    activity_type: "ENERGETICA",
    development_stage: "CONSTRUCAO",
    address: "Solar Valley, 456",
    email: "info@solarpower.com",
    activity_location: "Desert Area",
    activity_city: "Tete",
    activity_province: "TETE",
    insertion_point: "RURAL",
    territorial_planning_framework: "INDUSTRIAL",
    total_investment_value: 5000000,
    created_at: "2024-03-21",
  },
] as PreliminaryEnvironmentalForm[];

interface PreliminaryFormListProps {
  onEdit: (form: PreliminaryEnvironmentalForm) => void;
}

const ITEMS_PER_PAGE = 5;

const getActivityTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    TURISTICA: "Turística",
    INDUSTRIAL: "Industrial",
    AGRO_PECUARIA: "Agro-Pecuária",
    ENERGETICA: "Energética",
    SERVICOS: "Serviços",
    OUTRA: "Outra",
  };
  return labels[type] || type;
};

const getDevelopmentStageLabel = (stage: string) => {
  const labels: Record<string, string> = {
    NOVA: "Nova",
    REABILITACAO: "Reabilitação",
    EXPANSAO: "Expansão",
    OUTRO: "Outro",
  };
  return labels[stage] || stage;
};

export function PreliminaryFormList({ onEdit }: PreliminaryFormListProps) {
  const [forms, setForms] = useState<PreliminaryEnvironmentalForm[]>(initialForms);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    setForms(forms.filter(form => form.id !== id));
    setDeleteId(null);
    toast({
      title: "Form deleted",
      description: "The preliminary environmental form has been successfully deleted.",
    });
  };

  // Filter forms based on search query
  const filteredForms = forms.filter(form =>
    form.activity_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.activity_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.activity_city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredForms.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedForms = filteredForms.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search forms..."
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
            Showing {Math.min(startIndex + 1, filteredForms.length)} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredForms.length)} of{" "}
            {filteredForms.length} forms
          </span>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <div className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20%]">Activity Name</TableHead>
                <TableHead className="w-[15%]">Type</TableHead>
                <TableHead className="w-[15%]">Stage</TableHead>
                <TableHead className="w-[15%]">Location</TableHead>
                <TableHead className="w-[15%]">Province</TableHead>
                <TableHead className="w-[10%]">Investment</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">{form.activity_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      {getActivityTypeLabel(form.activity_type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800">
                      {getDevelopmentStageLabel(form.development_stage)}
                    </Badge>
                  </TableCell>
                  <TableCell>{form.activity_city}</TableCell>
                  <TableCell>{form.activity_province}</TableCell>
                  <TableCell>
                    {form.total_investment_value?.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(form)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(form.id)}
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
              This action cannot be undone. This will permanently delete the preliminary environmental form.
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