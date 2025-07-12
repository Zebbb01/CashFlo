// src/components/financial-management/modals/AssetManagement/AddAssetModal.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useSession } from "next-auth/react"; // Add this import for getting current user
import { useCreateAsset } from "@/hooks/financial-management/useAssets";
import { Company, Bank, User } from "@/types";

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  banks: Bank[];
  users: User[];
  isLoadingUsers: boolean;
}

export function AddAssetModal({ isOpen, onClose, companies, banks, users, isLoadingUsers }: AddAssetModalProps) {
  const [newAssetType, setNewAssetType] = useState("");
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetValue, setNewAssetValue] = useState<string>("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>("");

  const createAssetMutation = useCreateAsset();
  const { data: session } = useSession(); // Get current user session

  const currentUserId = session?.user?.id; // Get actual user ID from session

  React.useEffect(() => {
    if (currentUserId && !selectedOwnerId) {
      setSelectedOwnerId(currentUserId);
    } else if (!currentUserId && users.length > 0 && !selectedOwnerId) {
      setSelectedOwnerId(users[0].id);
    }
  }, [currentUserId, users, selectedOwnerId]);

  const handleAddAsset = async () => {
    if (!newAssetType || !newAssetName || !selectedCompanyId || !selectedOwnerId) {
      toast.warning("Missing Fields", {
        description: "Please fill in all required asset fields, select a company, and an owner.",
      });
      return;
    }

    let parsedAssetValue: number | null = null;
    if (newAssetValue !== "") {
      const value = parseFloat(newAssetValue);
      if (isNaN(value)) {
        toast.error("Invalid Input", {
          description: "Asset value must be a valid number if provided.",
        });
        return;
      }
      parsedAssetValue = value;
    }

    const bankIdToSend = selectedBankId === '__NULL__' ? null : selectedBankId;

    try {
      await createAssetMutation.mutateAsync({
        assetType: newAssetType,
        assetName: newAssetName,
        assetValue: parsedAssetValue,
        companyId: selectedCompanyId,
        bankId: bankIdToSend,
        userId: selectedOwnerId,
      });
      toast.success("Asset Added", {
        description: "Your new asset has been successfully added.",
      });
      setNewAssetType("");
      setNewAssetName("");
      setNewAssetValue("");
      setSelectedCompanyId("");
      setSelectedBankId(null);
      setSelectedOwnerId("");
      onClose();
    } catch (error: any) {
      toast.error("Failed to add asset", {
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
          <DialogDescription>
            Enter the details for the new asset. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newAssetType" className="text-right">
              Asset Type
            </Label>
            <Input
              id="newAssetType"
              placeholder="e.g., Real Estate, Stocks"
              value={newAssetType}
              onChange={(e) => setNewAssetType(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newAssetName" className="text-right">
              Asset Name
            </Label>
            <Input
              id="newAssetName"
              placeholder="e.g., House, Tesla Shares"
              value={newAssetName}
              onChange={(e) => setNewAssetName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newAssetValue" className="text-right">
              Asset Value (Optional)
            </Label>
            <Input
              id="newAssetValue"
              type="number"
              placeholder="e.g., 500000"
              value={newAssetValue}
              onChange={(e) => setNewAssetValue(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              Company
            </Label>
            <div className="col-span-3">
              {companies.length > 0 ? (
                <Select onValueChange={setSelectedCompanyId} value={selectedCompanyId}>
                  <SelectTrigger id="company">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-muted-foreground text-sm">No companies available. Please add a company first.</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bank" className="text-right">
              Bank (Optional)
            </Label>
            <div className="col-span-3">
              {banks.length > 0 ? (
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
                <p className="text-muted-foreground text-sm">No banks available. Please add a bank first.</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="owner" className="text-right">
              Owner
            </Label>
            <div className="col-span-3">
              {isLoadingUsers ? (
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
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleAddAsset}
            disabled={createAssetMutation.isPending || companies.length === 0 || users.length === 0 || !selectedOwnerId}
          >
            {createAssetMutation.isPending ? "Adding Asset..." : "Add Asset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}