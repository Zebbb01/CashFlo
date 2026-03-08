// This type represents a unified transaction item for the overview tab
// It combines relevant data from RevenueShare and CostAttribution
export type PartnershipTransaction = {
  id: string; // ID of the RevenueShare or CostAttribution record
  amount: number; // The 'shareAmount' or 'attributedAmount'
  date: Date; // The date of the original Revenue/Cost transaction
  description?: string | null; // Description from original Revenue/Cost
  userId: string; // The user (colleague) associated with this share/attribution
  bankAssetManagementId: string; // The asset this transaction belongs to
} & ({
  type: 'contribution'; // Discriminator for RevenueShare based entries
  source: string; // Specific to Revenue
} | {
  type: 'withdrawal'; // Discriminator for CostAttribution based entries
  category: string; // Specific to Cost
});

// Define a union type for transactions to be displayed in the dashboard table
export type DashboardTransaction = {
  id: string;
  amount: number;
  date: Date;
  description?: string | null;
  userId?: string | null;
  bankAssetManagementId?: string | null;
} & ({
  type: 'revenue';
  source: string;
} | {
  type: 'cost';
  category: string;
});
