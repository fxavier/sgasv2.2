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
const initialChecklists = [
  {
    id: 1,
    descricao: "Bandages",
    quantidade: 10,
    data: "2024-03-20",
    prazo: "2024-12-31",
    observacao: "Need to restock soon",
    inspecao_realizada_por: "John Doe",
  },
  {
    id: 2,
    descricao: "Antiseptic Solution",
    quantidade: 5,
    data: "2024-03-21",
    prazo: "2024-06-30",
    observacao: "All bottles sealed",
    inspecao_realizada_por: "Jane Smith",
  },
] as FirstAidKitChecklist[];

interface FirstAidKitChecklistListProps {
  onEdit: (checklist: FirstAidKitChecklist) => void;
}

const ITEMS_PER_PAGE = 5;

export function FirstAidKitChecklistList({ onEdit }: FirstAidKitChecklistListProps) {
  const [checklists, setChecklists] = useState<FirstAidKitChecklist[]>(initialChecklists);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    setChecklists(checklists.filter(checklist => checklist.id !== id));
    setDeleteId(null);
    toast({
      title: "Checklist deleted",
      description: "The first aid kit checklist has been successfully deleted.",
    });
  };

  // Filter checklists based on search query
  const filteredChecklists = checklists.filter(checklist =>
    checklist.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
    checklist.inspecao_realizada_por.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredChecklists.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedChecklists = filteredChecklists.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search checklists..."
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
            Showing {Math.min(startIndex + 1, filteredChecklists.length)} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredChecklists.length)} of{" "}
            {filteredChecklists.length} items
          </span>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <div className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[25%]">Description</TableHead>
                <TableHead className="w-[10%]">Quantity</TableHead>
                <TableHead className="w-[15%]">Date</TableHead>
                <TableHead className="w-[15%]">Deadline</TableHead>
                <TableHead className="w-[20%]">Inspector</TableHead>
                <TableHead className="w-[15%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedChecklists.map((checklist) => (
                <TableRow key={checklist.id}>
                  <TableCell className="font-medium">{checklist.descricao}</TableCell>
                  <TableCell>{checklist.quantidade}</TableCell>
                  <TableCell>{new Date(checklist.data).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(checklist.prazo).toLocaleDateString()}</TableCell>
                  <TableCell>{checklist.inspecao_realizada_por}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(checklist)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(checklist.id)}
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
              This action cannot be undone. This will permanently delete the first aid kit checklist.
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