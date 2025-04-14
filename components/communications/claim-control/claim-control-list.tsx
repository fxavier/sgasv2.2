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
const initialClaims = [
  {
    id: 1,
    number: "CC-2024-001",
    claim_complain_submitted_by: "John Smith",
    claim_complain_reception_date: "2024-03-20",
    claim_complain_description: "Noise complaint from construction site",
    claim_complain_responsible_person: "Jane Doe",
    claim_complain_deadline: "2024-04-20",
    claim_complain_status: "PENDING",
    closure_date: "2024-04-30",
  },
  {
    id: 2,
    number: "CC-2024-002",
    claim_complain_submitted_by: "Alice Johnson",
    claim_complain_reception_date: "2024-03-21",
    claim_complain_description: "Environmental concern regarding waste disposal",
    claim_complain_responsible_person: "Bob Wilson",
    claim_complain_deadline: "2024-04-21",
    claim_complain_status: "IN_PROGRESS",
    closure_date: "2024-05-01",
  },
] as ClaimComplainControl[];

interface ClaimControlListProps {
  onEdit: (claim: ClaimComplainControl) => void;
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

export function ClaimControlList({ onEdit }: ClaimControlListProps) {
  const [claims, setClaims] = useState<ClaimComplainControl[]>(initialClaims);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    setClaims(claims.filter(claim => claim.id !== id));
    setDeleteId(null);
    toast({
      title: "Claim deleted",
      description: "The claim/complaint has been successfully deleted.",
    });
  };

  // Filter claims based on search query
  const filteredClaims = claims.filter(claim =>
    claim.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    claim.claim_complain_submitted_by.toLowerCase().includes(searchQuery.toLowerCase()) ||
    claim.claim_complain_description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredClaims.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedClaims = filteredClaims.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search claims..."
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
            Showing {Math.min(startIndex + 1, filteredClaims.length)} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredClaims.length)} of{" "}
            {filteredClaims.length} claims
          </span>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <div className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%]">Number</TableHead>
                <TableHead className="w-[15%]">Submitted By</TableHead>
                <TableHead className="w-[25%]">Description</TableHead>
                <TableHead className="w-[15%]">Responsible</TableHead>
                <TableHead className="w-[10%]">Status</TableHead>
                <TableHead className="w-[10%]">Deadline</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">{claim.number}</TableCell>
                  <TableCell>{claim.claim_complain_submitted_by}</TableCell>
                  <TableCell>
                    <div className="line-clamp-2">{claim.claim_complain_description}</div>
                  </TableCell>
                  <TableCell>{claim.claim_complain_responsible_person}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(claim.claim_complain_status)}>
                      {claim.claim_complain_status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(claim.claim_complain_deadline).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(claim)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(claim.id)}
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
              This action cannot be undone. This will permanently delete the claim/complaint.
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