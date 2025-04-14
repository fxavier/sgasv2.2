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
    incidents: [{ id: 1, description: "Near Miss" }],
    date_incident: "2024-03-20",
    time_incident: "09:30",
    section: "Construction",
    location_incident: "Building A",
    date_reported: "2024-03-20",
    supervisor: "John Doe",
    type: "Employee",
    employee_name: "James Smith",
    incident_description: "Worker slipped but caught balance, no injury",
    details_of_injured_person: "No injury sustained",
    preliminary_findings: "Wet floor without warning sign",
    recomendations: "Install warning signs and improve housekeeping",
    further_investigation_required: "No",
    incident_reportable: "No",
    lenders_to_be_notified: "No",
    author_of_report: "Sarah Johnson",
    date_created: "2024-03-20",
    approver_name: "Michael Brown",
    date_approved: "2024-03-21",
  },
  {
    id: 2,
    incidents: [{ id: 2, description: "Property Damage" }],
    date_incident: "2024-03-21",
    time_incident: "14:15",
    section: "Warehouse",
    location_incident: "Storage Area B",
    date_reported: "2024-03-21",
    supervisor: "Jane Smith",
    type: "Subcontrator",
    subcontrator_name: "ABC Construction",
    incident_description: "Forklift collision with storage rack",
    details_of_injured_person: "No personnel involved",
    preliminary_findings: "Operator error during maneuvering",
    recomendations: "Refresher training for forklift operators",
    further_investigation_required: "Yes",
    incident_reportable: "Yes",
    lenders_to_be_notified: "No",
    author_of_report: "Robert Wilson",
    date_created: "2024-03-21",
    approver_name: "David Clark",
    date_approved: "2024-03-22",
  },
] as IncidentFlashReport[];

interface IncidentFlashReportListProps {
  onEdit: (report: IncidentFlashReport) => void;
}

const ITEMS_PER_PAGE = 5;

const getInvestigationColor = (required: string) => {
  return required === 'Yes' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
};

const getReportableColor = (reportable: string) => {
  return reportable === 'Yes' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
};

export function IncidentFlashReportList({ onEdit }: IncidentFlashReportListProps) {
  const [reports, setReports] = useState<IncidentFlashReport[]>(initialReports);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    setReports(reports.filter(report => report.id !== id));
    setDeleteId(null);
    toast({
      title: "Report deleted",
      description: "The incident flash report has been successfully deleted.",
    });
  };

  // Filter reports based on search query
  const filteredReports = reports.filter(report =>
    report.location_incident.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.supervisor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.incident_description.toLowerCase().includes(searchQuery.toLowerCase())
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
                <TableHead className="w-[15%]">Date/Time</TableHead>
                <TableHead className="w-[15%]">Location</TableHead>
                <TableHead className="w-[15%]">Supervisor</TableHead>
                <TableHead className="w-[20%]">Description</TableHead>
                <TableHead className="w-[10%]">Investigation</TableHead>
                <TableHead className="w-[10%]">Reportable</TableHead>
                <TableHead className="w-[15%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    {new Date(report.date_incident).toLocaleDateString()}
                    <br />
                    <span className="text-sm text-gray-500">{report.time_incident}</span>
                  </TableCell>
                  <TableCell>{report.location_incident}</TableCell>
                  <TableCell>{report.supervisor}</TableCell>
                  <TableCell>
                    <div className="line-clamp-2">{report.incident_description}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getInvestigationColor(report.further_investigation_required)}>
                      {report.further_investigation_required}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getReportableColor(report.incident_reportable)}>
                      {report.incident_reportable}
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
              This action cannot be undone. This will permanently delete the incident flash report.
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