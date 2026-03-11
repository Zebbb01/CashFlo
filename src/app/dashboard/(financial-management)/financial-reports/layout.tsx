import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Reports and Export",
};

export default function FinancialReportsLayout({
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
