// src/components/financial-management/modals/AssetManagement/ViewAssetModal.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Asset } from "@/types"; // Ensure Asset type includes 'owner' relation

interface ViewAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null; // The asset to be viewed
}

export function ViewAssetModal({ isOpen, onClose, asset }: ViewAssetModalProps) {
  if (!asset) {
    return null; // Don't render if no asset is provided
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Asset Details</DialogTitle>
          <DialogDescription>
            Detailed information about the asset.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Asset Name:</Label>
            <span className="col-span-3">{asset.assetName}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Asset Type:</Label>
            <span className="col-span-3">{asset.assetType}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Company:</Label>
            <span className="col-span-3">{asset.company?.name || "N/A"}</span>
          </div>
          {/* Display Bank Information */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Bank:</Label>
            <span className="col-span-3">{asset.bank?.name || "N/A"}</span>
          </div>
          {/* NEW: Display Asset Owner Information */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Owner:</Label>
            <span className="col-span-3">{asset.owner?.name || asset.owner?.email || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Value:</Label>
            <span className="col-span-3">
              ₱{asset.assetValue?.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Status:</Label>
            <span className="col-span-3">
              {asset.deletedAt ? (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Soft-Deleted</span>
              ) : (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
              )}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Created At:</Label>
            <span className="col-span-3">{new Date(asset.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Last Updated:</Label>
            <span className="col-span-3">{new Date(asset.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
