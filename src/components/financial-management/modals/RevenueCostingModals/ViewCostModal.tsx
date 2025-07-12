// src/components/financial-management/modals/ViewCostModal.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Cost } from "@/types"; // Ensure Cost type includes 'user' and 'costAttributions' relations

interface ViewCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  cost: Cost | null;
}

export function ViewCostModal({ isOpen, onClose, cost }: ViewCostModalProps) {
  if (!cost) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cost Details</DialogTitle>
          <DialogDescription>
            Detailed information about the cost entry.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Category:</Label>
            <span className="col-span-3">{cost.category}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Amount:</Label>
            <span className="col-span-3">₱{cost.amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Date:</Label>
            <span className="col-span-3">{new Date(cost.date).toLocaleDateString()}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Description:</Label>
            <span className="col-span-3">{cost.description || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Bank Asset:</Label>
            <span className="col-span-3">
              {cost.bankAssetManagement?.assetName || "N/A"}
              {cost.bankAssetManagement?.company?.name && ` (Company: ${cost.bankAssetManagement.company.name})`}
            </span>
          </div>
          {/* NEW: Display Incurred By User */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Incurred By:</Label>
            <span className="col-span-3">{cost.user?.name || cost.user?.email || "N/A"}</span>
          </div>
          {/* NEW: Display Cost Attributions */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right font-medium">Attributed To:</Label>
            <div className="col-span-3 space-y-1">
              {cost.costAttributions && cost.costAttributions.length > 0 ? (
                cost.costAttributions.map(attribution => (
                  <div key={attribution.id} className="flex justify-between items-center text-sm">
                    <span>{attribution.user?.name || attribution.user?.email || 'N/A'}</span>
                    <span>₱{attribution.attributedAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({attribution.percentage.toFixed(2)}%)</span>
                  </div>
                ))
              ) : (
                <span>No specific attributions.</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Created At:</Label>
            <span className="col-span-3">{new Date(cost.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Last Updated:</Label>
            <span className="col-span-3">{new Date(cost.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
