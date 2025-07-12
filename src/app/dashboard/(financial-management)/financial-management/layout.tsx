import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Financial Management",
};

export default function FinancialManagementLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            {children}
        </div>
    );
}