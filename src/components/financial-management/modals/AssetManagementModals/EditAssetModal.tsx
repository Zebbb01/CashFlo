// src/components/financial-management/modals/AssetManagement/EditAssetModal.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useUpdateAsset } from "@/hooks/financial-management/useAssets";
import { Company, Asset, Bank, User } from "@/types";

interface EditAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
  companies: Company[];
  banks: Bank[];
  users: User[];
  isLoadingUsers: boolean; // FIXED: Added isLoadingUsers prop
}

export function EditAssetModal({ isOpen, onClose, asset, companies, banks, users, isLoadingUsers }: EditAssetModalProps) {
  const [assetType, setAssetType] = useState(asset?.assetType || "");
  const [assetName, setAssetName] = useState(asset?.assetName || "");
  const [assetValue, setAssetValue] = useState<string>(asset?.assetValue?.toString() || "");
  const [companyId, setCompanyId] = useState(asset?.companyId || "");
  const [selectedBankId, setSelectedBankId] = useState<string | null>(asset?.bankId || null);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>(asset?.userId || "");

  const updateAssetMutation = useUpdateAsset();

  useEffect(() => {
    if (asset) {
      setAssetType(asset.assetType);
      setAssetName(asset.assetName);
      setAssetValue(asset.assetValue?.toString() || "");
      setCompanyId(asset.companyId || "");
      setSelectedBankId(asset.bankId || null);
      setSelectedOwnerId(asset.userId || "");
    } else {
      setAssetType("");
      setAssetName("");
      setAssetValue("");
      setCompanyId("");
      setSelectedBankId(null);
      setSelectedOwnerId("");
    }
  }, [asset]);

  const handleUpdateAsset = async () => {
    if (!asset || !assetType || !assetName || !selectedOwnerId) {
      toast.warning("Missing Fields", {
        description: "Please fill in all required asset fields (Asset Type, Name, Owner).",
      });
      return;
    }

    const parsedAssetValue = assetValue === "" ? null : parseFloat(assetValue);

    if (assetValue !== "" && isNaN(parsedAssetValue as number)) {
      toast.error("Invalid Input", {
        description: "Asset value must be a valid number or left empty.",
      });
      return;
    }

    const bankIdToSend = selectedBankId === '__NULL__' ? null : selectedBankId;

    try {
      await updateAssetMutation.mutateAsync({
        id: asset.id,
        payload: {
          assetType,
          assetName,
          assetValue: parsedAssetValue,
          companyId: companyId || undefined,
          bankId: bankIdToSend,
          userId: selectedOwnerId,
        },
      });
      toast.success("Asset Updated", {
        description: `Asset "${assetName}" has been successfully updated.`,
      });
      onClose();
    } catch (error: any) {
      toast.error("Failed to update asset", {
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-2xl font-bold">Edit Asset</DialogTitle>
          <DialogDescription className="text-center">
            Make changes to the asset here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="assetType" className="text-foreground font-semibold">
              Asset Type
            </Label>
            <Input
              id="assetType"
              placeholder="e.g., Real Estate, Stocks"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assetName" className="text-foreground font-semibold">
              Asset Name
            </Label>
            <Input
              id="assetName"
              placeholder="e.g., House, Tesla Shares"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assetValue" className="text-foreground font-semibold">
              Asset Value <span className="text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <CurrencyInput
              id="assetValue"
              placeholder="e.g., 500000 (Optional)"
              value={assetValue}
              onChange={(e) => setAssetValue(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company" className="text-foreground font-semibold">
              Company <span className="text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <div className="w-full">
              <Select onValueChange={(value) => setCompanyId(value === '__NULL__' ? '' : value)} value={companyId || '__NULL__'}>
                <SelectTrigger id="company">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__NULL__">None (Personal)</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bank" className="text-foreground font-semibold">
              Bank <span className="text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <div className="w-full">
              {banks && banks.length > 0 ? (
                <Select onValueChange={(value) => setSelectedBankId(value === '__NULL__' ? null : value)} value={selectedBankId || '__NULL__'}>
                  <SelectTrigger id="bank">
                    <SelectValue placeholder="Select a bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__NULL__">None</SelectItem>
                    {banks.map((bank) => (
                      <SelectItem key={bank.id} value={bank.id}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-muted-foreground text-sm">No banks available.</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="owner" className="text-foreground font-semibold">
              Owner
            </Label>
            <div className="w-full">
              {isLoadingUsers ? ( // Use isLoadingUsers prop here
                <p>Loading users...</p>
              ) : users && users.length > 0 ? (
                <Select onValueChange={setSelectedOwnerId} value={selectedOwnerId}>
                  <SelectTrigger id="owner">
                    <SelectValue placeholder="Select an owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-muted-foreground text-sm">No users available. Cannot assign owner.</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-center pt-2">
          <Button
            type="submit"
            size="lg"
            variant="gradient"
            className="w-full max-w-sm"
            onClick={handleUpdateAsset}
            disabled={updateAssetMutation.isPending}
          >
            {updateAssetMutation.isPending ? "Saving changes..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
