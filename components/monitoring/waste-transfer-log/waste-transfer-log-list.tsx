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
const initialLogs = [
  {
    id: 1,
    waste_type: "Plastic",
    how_is_waste_contained: "Sealed containers",
    how_much_waste: 100,
    reference_number: "WT-2024-001",
    date_of_removal: "2024-03-20",
    transfer_company: "EcoWaste Solutions",
    special_instructions: "Handle with care, recyclable materials",
  },
  {
    id: 2,
    waste_type: "Electronic",
    how_is_waste_contained: "Protective boxes",
    how_much_waste: 50,
    reference_number: "WT-2024-002",
    date_of_removal: "2024-03-21",
    transfer_company: "TechRecycle Inc",
    special_instructions: "Contains sensitive electronic components",
  },
] as WasteTransferLog[];

interface WasteTransferLogListProps {
  onEdit: (log: WasteTransferLog) => void;
}

const ITEMS_PER_PAGE = 5;

export function WasteTransferLogList({ onEdit }: WasteTransferLogListProps) {
  const [logs, setLogs] = useState<WasteTransferLog[]>(initialLogs);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    setLogs(logs.filter(log => log.id !== id));
    setDeleteId(null);
    toast({
      title: "Log deleted",
      description: "The waste transfer log has been successfully deleted.",
    });
  };

  // Filter logs based on search query
  const filteredLogs = logs.filter(log =>
    log.waste_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.reference_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.transfer_company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search logs..."
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
            Showing {Math.min(startIndex + 1, filteredLogs.length)} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredLogs.length)} of{" "}
            {filteredLogs.length} logs
          </span>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <div className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%]">Reference</TableHead>
                <TableHead className="w-[15%]">Waste Type</TableHead>
                <TableHead className="w-[15%]">Containment</TableHead>
                <TableHead className="w-[10%]">Amount</TableHead>
                <TableHead className="w-[15%]">Company</TableHead>
                <TableHead className="w-[20%]">Instructions</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.reference_number}</TableCell>
                  <TableCell>{log.waste_type}</TableCell>
                  <TableCell>{log.how_is_waste_contained}</TableCell>
                  <TableCell>{log.how_much_waste}</TableCell>
                  <TableCell>{log.transfer_company}</TableCell>
                  <TableCell>
                    <div className="line-clamp-2">{log.special_instructions}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(log)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(log.id)}
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
              This action cannot be undone. This will permanently delete the waste transfer log.
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