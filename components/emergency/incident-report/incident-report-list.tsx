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
const initialReports = [
  {
    id: 1,
    nome: "John Doe",
    funcao: "Operator",
    departamento: { id: 1, name: "Operations" },
    data: "2024-03-20",
    hora: "09:30",
    local: "Building A",
    tipo_de_incidente: "Segurança",
    natureza_e_extensao_incidente: "Ferimento leve",
    descricao_do_acidente: "Slip and fall incident during routine inspection",
    colaborador_recebeu_treinamento: "Sim",
  },
  {
    id: 2,
    nome: "Jane Smith",
    funcao: "Technician",
    departamento: { id: 2, name: "Engineering" },
    data: "2024-03-21",
    hora: "14:15",
    local: "Workshop",
    tipo_de_incidente: "Infraestruturas",
    natureza_e_extensao_incidente: "Nenhum",
    descricao_do_acidente: "Equipment malfunction during maintenance",
    colaborador_recebeu_treinamento: "Sim",
  },
] as IncidentReport[];

interface IncidentReportListProps {
  onEdit: (report: IncidentReport) => void;
}

const ITEMS_PER_PAGE = 5;

const getIncidentTypeColor = (type: string) => {
  const colors = {
    'Humano': 'bg-blue-100 text-blue-800',
    'Segurança': 'bg-red-100 text-red-800',
    'Infraestruturas': 'bg-yellow-100 text-yellow-800',
    'Ambiental': 'bg-green-100 text-green-800',
    'Social': 'bg-purple-100 text-purple-800',
    'Outros': 'bg-gray-100 text-gray-800',
  };
  return colors[type as keyof typeof colors] || colors.Outros;
};

const getNatureColor = (nature: string) => {
  const colors = {
    'Intoxicação leve': 'bg-yellow-100 text-yellow-800',
    'Intoxicação grave': 'bg-red-100 text-red-800',
    'Ferimento leve': 'bg-blue-100 text-blue-800',
    'Ferimento grave': 'bg-red-100 text-red-800',
    'Morte': 'bg-black text-white',
    'Nenhum': 'bg-green-100 text-green-800',
    'Outros': 'bg-gray-100 text-gray-800',
  };
  return colors[nature as keyof typeof colors] || colors.Outros;
};

export function IncidentReportList({ onEdit }: IncidentReportListProps) {
  const [reports, setReports] = useState<IncidentReport[]>(initialReports);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    setReports(reports.filter(report => report.id !== id));
    setDeleteId(null);
    toast({
      title: "Report deleted",
      description: "The incident report has been successfully deleted.",
    });
  };

  // Filter reports based on search query
  const filteredReports = reports.filter(report =>
    report.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.local.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.descricao_do_acidente.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search reports..."
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
            Showing {Math.min(startIndex + 1, filteredReports.length)} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredReports.length)} of{" "}
            {filteredReports.length} reports
          </span>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <div className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%]">Name</TableHead>
                <TableHead className="w-[15%]">Department</TableHead>
                <TableHead className="w-[15%]">Date/Time</TableHead>
                <TableHead className="w-[15%]">Location</TableHead>
                <TableHead className="w-[10%]">Type</TableHead>
                <TableHead className="w-[15%]">Nature</TableHead>
                <TableHead className="w-[15%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.nome}</TableCell>
                  <TableCell>{report.departamento?.name}</TableCell>
                  <TableCell>
                    {new Date(report.data).toLocaleDateString()}
                    <br />
                    <span className="text-sm text-gray-500">{report.hora}</span>
                  </TableCell>
                  <TableCell>{report.local}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getIncidentTypeColor(report.tipo_de_incidente)}>
                      {report.tipo_de_incidente}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getNatureColor(report.natureza_e_extensao_incidente)}>
                      {report.natureza_e_extensao_incidente}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(report)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(report.id)}
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
              This action cannot be undone. This will permanently delete the incident report.
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