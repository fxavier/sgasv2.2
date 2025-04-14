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
const initialComplaints = [
  {
    id: 1,
    number: "CR-2024-001",
    date_occurred: "2024-03-20",
    local_occurrence: "Site A",
    who_involved: "Construction Team",
    complaintant_gender: "MALE",
    complaintant_age: 35,
    claim_category: "Noise",
    resolution_type: "Internal resolution",
    complaintant_satisfaction: "SATISFIED",
    monitoring_after_closure: "YES",
  },
  {
    id: 2,
    number: "CR-2024-002",
    date_occurred: "2024-03-21",
    local_occurrence: "Site B",
    who_involved: "Operations Team",
    complaintant_gender: "FEMALE",
    complaintant_age: 42,
    claim_category: "Odor",
    resolution_type: "Second level resolution",
    complaintant_satisfaction: "NOT_SATISFIED",
    monitoring_after_closure: "NO",
  },
] as ComplaintAndClaimRecord[];

interface ComplaintsRegistrationListProps {
  onEdit: (complaint: ComplaintAndClaimRecord) => void;
}

const ITEMS_PER_PAGE = 5;

const getClaimCategoryColor = (category: string) => {
  const colors = {
    'Odor': 'bg-purple-100 text-purple-800',
    'Noise': 'bg-blue-100 text-blue-800',
    'Effluents': 'bg-green-100 text-green-800',
    'Company vehicles': 'bg-yellow-100 text-yellow-800',
    'Flow of migrant workers': 'bg-orange-100 text-orange-800',
    'Security personnel': 'bg-red-100 text-red-800',
    'GBV/SA/SEA': 'bg-pink-100 text-pink-800',
    'Other': 'bg-gray-100 text-gray-800',
  };
  return colors[category as keyof typeof colors] || colors.Other;
};

const getSatisfactionColor = (satisfaction: string) => {
  return satisfaction === 'SATISFIED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
};

export function ComplaintsRegistrationList({ onEdit }: ComplaintsRegistrationListProps) {
  const [complaints, setComplaints] = useState<ComplaintAndClaimRecord[]>(initialComplaints);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    setComplaints(complaints.filter(complaint => complaint.id !== id));
    setDeleteId(null);
    toast({
      title: "Registration deleted",
      description: "The complaint registration has been successfully deleted.",
    });
  };

  // Filter complaints based on search query
  const filteredComplaints = complaints.filter(complaint =>
    complaint.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.local_occurrence.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.who_involved.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedComplaints = filteredComplaints.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search registrations..."
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
            Showing {Math.min(startIndex + 1, filteredComplaints.length)} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredComplaints.length)} of{" "}
            {filteredComplaints.length} registrations
          </span>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <div className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%]">Number</TableHead>
                <TableHead className="w-[15%]">Location</TableHead>
                <TableHead className="w-[15%]">Who Involved</TableHead>
                <TableHead className="w-[15%]">Category</TableHead>
                <TableHead className="w-[15%]">Resolution</TableHead>
                <TableHead className="w-[15%]">Satisfaction</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedComplaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-medium">{complaint.number}</TableCell>
                  <TableCell>{complaint.local_occurrence}</TableCell>
                  <TableCell>{complaint.who_involved}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getClaimCategoryColor(complaint.claim_category)}>
                      {complaint.claim_category}
                    </Badge>
                  </TableCell>
                  <TableCell>{complaint.resolution_type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getSatisfactionColor(complaint.complaintant_satisfaction)}>
                      {complaint.complaintant_satisfaction === 'SATISFIED' ? 'Satisfied' : 'Not Satisfied'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(complaint)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(complaint.id)}
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
              This action cannot be undone. This will permanently delete the complaint registration.
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