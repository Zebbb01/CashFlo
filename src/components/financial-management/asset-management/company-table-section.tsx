// src/components/financial-management/asset-management/company-table-section.tsx
'use client';

import React from "react";
import { Company } from "@/types";
import { DataTable } from "@/components/data-table";

interface CompanyTableSectionProps {
    companies: Company[];
    isLoadingCompanies: boolean;
}

export function CompanyTableSection({ companies, isLoadingCompanies }: CompanyTableSectionProps) {
    const companyColumns = [
        {
            header: "Company Name",
            accessorKey: "name",
            cell: (company: Company) => <span className="font-medium">{company.name}</span>,
        },
        {
            header: "Description",
            accessorKey: "description",
            cell: (company: Company) => company.description || "N/A",
        },
    ];

    return (
        <>
            <h3 className="text-lg font-semibold mt-6 mb-2">Companies Overview</h3>
            <DataTable
                columns={companyColumns}
                data={companies}
                isLoading={isLoadingCompanies}
                noDataMessage="No companies found. Add your first company above!"
            />
        </>
    );
}
