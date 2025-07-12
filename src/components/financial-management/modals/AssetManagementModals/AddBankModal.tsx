// src/components/financial-management/modals/AssetManagement/AddBankModal.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateBank } from '@/hooks/financial-management/useBanks';
import { toast } from 'sonner';

interface AddBankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBankModal({ isOpen, onClose }: AddBankModalProps) {
  const [bankName, setBankName] = useState('');
  const createBankMutation = useCreateBank();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName.trim()) {
      toast.error('Bank name is required.');
      return;
    }

    try {
      await createBankMutation.mutateAsync({
        name: bankName,
      });
      toast.success('Bank added successfully!');
      setBankName('');
      onClose();
    } catch (error: any) {
      toast.error('Failed to add bank', {
        description: error.message || 'An unexpected error occurred.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Bank</DialogTitle>
          <DialogDescription>
            Enter the details for the new bank.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bankName" className="text-right">
              Bank Name
            </Label>
            <Input
              id="bankName"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., CIMB, BPI, Metrobank"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createBankMutation.isPending}>
              {createBankMutation.isPending ? 'Adding Bank...' : 'Add Bank'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
