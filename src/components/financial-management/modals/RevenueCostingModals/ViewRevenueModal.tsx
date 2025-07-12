// src/components/financial-management/modals/ViewRevenueModal.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Revenue } from "@/types"; // Ensure Revenue type includes 'user' and 'revenueShares' relations

interface ViewRevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  revenue: Revenue | null;
}

export function ViewRevenueModal({ isOpen, onClose, revenue }: ViewRevenueModalProps) {
  if (!revenue) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Revenue Details</DialogTitle>
          <DialogDescription>
            Detailed information about the revenue entry.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Source:</Label>
            <span className="col-span-3">{revenue.source}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Amount:</Label>
            <span className="col-span-3">₱{revenue.amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Date:</Label>
            <span className="col-span-3">{new Date(revenue.date).toLocaleDateString()}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Description:</Label>
            <span className="col-span-3">{revenue.description || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Bank Asset:</Label>
            <span className="col-span-3">
              {revenue.bankAssetManagement?.assetName || "N/A"}
              {revenue.bankAssetManagement?.company?.name && ` (Company: ${revenue.bankAssetManagement.company.name})`}
            </span>
          </div>
          {/* NEW: Display Recorded By User */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Recorded By:</Label>
            <span className="col-span-3">{revenue.user?.name || revenue.user?.email || "N/A"}</span>
          </div>
          {/* NEW: Display Revenue Shares */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right font-medium">Shared With:</Label>
            <div className="col-span-3 space-y-1">
              {revenue.revenueShares && revenue.revenueShares.length > 0 ? (
                revenue.revenueShares.map(share => (
                  <div key={share.id} className="flex justify-between items-center text-sm">
                    <span>{share.user?.name || share.user?.email || 'N/A'}</span>
                    <span>₱{share.shareAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({share.percentage.toFixed(2)}%)</span>
                  </div>
                ))
              ) : (
                <span>No specific shares.</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Created At:</Label>
            <span className="col-span-3">{new Date(revenue.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Last Updated:</Label>
            <span className="col-span-3">{new Date(revenue.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
