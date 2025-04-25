'use client';

import { useState } from 'react';
import { WasteTransferLogList } from '@/components/monitoring/waste-transfer-log/waste-transfer-log-list';
import {
  WasteTransferLogForm,
  WasteTransferLog,
} from '@/components/monitoring/waste-transfer-log/waste-transfer-log-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function WasteTransferLogPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<WasteTransferLog | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (log: WasteTransferLog) => {
    setEditingLog(log);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    // Trigger a refresh of the list
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className='container mx-auto max-w-7xl px-4 py-6 space-y-8'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-3xl font-bold text-gray-900'>
            FR.AS.031 Waste Transfer Log
          </h1>
          <p className='text-gray-500 mt-2'>
            Manage and track waste transfer records
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingLog(null);
            setIsFormOpen(true);
          }}
          className='flex items-center gap-2 w-full sm:w-auto'
        >
          <Plus className='h-4 w-4' />
          Add Transfer Log
        </Button>
      </div>

      <WasteTransferLogList onEdit={handleEdit} refreshKey={refreshKey} />

      <WasteTransferLogForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        log={editingLog}
        onClose={() => {
          setIsFormOpen(false);
          setEditingLog(null);
        }}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
