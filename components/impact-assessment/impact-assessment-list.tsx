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
const initialAssessments = [
  {
    id: 1,
    activity: "Construction of new facility",
    risks_and_impact: { id: 1, description: "Air Quality Impact" },
    environmental_factor: { id: 1, description: "Air" },
    life_cycle: "CONSTRUCAO",
    statute: "NEGATIVO",
    extension: "LOCAL",
    duration: "MEDIO_PRAZO",
    intensity: "MEDIA",
    probability: "PROVAVEL",
    description_of_measures: "Implementation of dust control measures",
    deadline: "2024-06-30",
    responsible: "John Doe",
    effectiveness_assessment: "EFFECTIVE",
    compliance_requirements: "Local air quality regulations",
    observations: "Regular monitoring required",
  },
  {
    id: 2,
    activity: "Wastewater treatment upgrade",
    risks_and_impact: { id: 2, description: "Water Quality Impact" },
    environmental_factor: { id: 2, description: "Water" },
    life_cycle: "OPERACAO",
    statute: "POSITIVO",
    extension: "REGIONAL",
    duration: "LONGO_PRAZO",
    intensity: "ALTA",
    probability: "DEFINITIVA",
    description_of_measures: "Installation of advanced treatment systems",
    deadline: "2024-12-31",
    responsible: "Jane Smith",
    effectiveness_assessment: "EFFECTIVE",
    compliance_requirements: "National water quality standards",
    observations: "Quarterly testing required",
  },
] as ImpactAssessment[];

interface ImpactAssessmentListProps {
  onEdit: (assessment: ImpactAssessment) => void;
}

const ITEMS_PER_PAGE = 5;

const getStatuteColor = (statute: string) => {
  return statute === "POSITIVO" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
};

const getLifeCycleLabel = (cycle: string) => {
  const labels: Record<string, string> = {
    PRE_CONSTRUCAO: "Pré-Construção",
    CONSTRUCAO: "Construção",
    OPERACAO: "Operação",
    DESATIVACAO: "Desativação",
    ENCERRAMENTO: "Encerramento",
    REINTEGRACAO_RESTAURACAO: "Reintegração/Restauração",
  };
  return labels[cycle] || cycle;
};

export function ImpactAssessmentList({ onEdit }: ImpactAssessmentListProps) {
  const [assessments, setAssessments] = useState<ImpactAssessment[]>(initialAssessments);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    setAssessments(assessments.filter(assessment => assessment.id !== id));
    setDeleteId(null);
    toast({
      title: "Assessment deleted",
      description: "The impact assessment has been successfully deleted.",
    });
  };

  // Filter assessments based on search query
  const filteredAssessments = assessments.filter(assessment =>
    assessment.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assessment.risks_and_impact.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assessment.environmental_factor.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredAssessments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAssessments = filteredAssessments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search assessments..."
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
            Showing {Math.min(startIndex + 1, filteredAssessments.length)} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredAssessments.length)} of{" "}
            {filteredAssessments.length} assessments
          </span>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <div className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20%]">Activity</TableHead>
                <TableHead className="w-[15%]">Risk & Impact</TableHead>
                <TableHead className="w-[15%]">Life Cycle</TableHead>
                <TableHead className="w-[10%]">Statute</TableHead>
                <TableHead className="w-[15%]">Deadline</TableHead>
                <TableHead className="w-[15%]">Responsible</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAssessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell className="font-medium break-words">
                    {assessment.activity}
                  </TableCell>
                  <TableCell className="break-words">
                    {assessment.risks_and_impact.description}
                  </TableCell>
                  <TableCell>{getLifeCycleLabel(assessment.life_cycle)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatuteColor(assessment.statute)}>
                      {assessment.statute === "POSITIVO" ? "Positivo" : "Negativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(assessment.deadline).toLocaleDateString()}</TableCell>
                  <TableCell className="break-words">{assessment.responsible}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(assessment)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(assessment.id)}
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
              This action cannot be undone. This will permanently delete the impact assessment.
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