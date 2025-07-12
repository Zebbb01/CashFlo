// src/components/financial-management/modals/AssetManagement/AddCompanyModal.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCreateCompany } from "@/hooks/financial-management/useCompanies";

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCompanyModal({ isOpen, onClose }: AddCompanyModalProps) {
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyDescription, setNewCompanyDescription] = useState("");

  const createCompanyMutation = useCreateCompany();

  const handleAddCompany = async () => {
    if (!newCompanyName.trim()) {
      toast.warning("Missing Fields", {
        description: "Company name cannot be empty.",
      });
      return;
    }

    try {
      await createCompanyMutation.mutateAsync({
        name: newCompanyName,
        description: newCompanyDescription || undefined, // Send undefined if empty string
      });
      toast.success("Company Added", {
        description: `Company "${newCompanyName}" has been successfully added.`,
      });
      setNewCompanyName("");
      setNewCompanyDescription("");
      onClose(); // Close the modal on success
    } catch (error: any) {
      toast.error("Failed to add company", {
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
          <DialogDescription>
            Enter the details for the new company. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="companyName" className="text-right">
              Name
            </Label>
            <Input
              id="companyName"
              placeholder="e.g., Acme Corp."
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="companyDescription" className="text-right">
              Description
            </Label>
            <Textarea
              id="companyDescription"
              placeholder="Brief description of the company."
              value={newCompanyDescription}
              onChange={(e) => setNewCompanyDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleAddCompany}
            disabled={createCompanyMutation.isPending}
          >
            {createCompanyMutation.isPending ? "Adding Company..." : "Add Company"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
