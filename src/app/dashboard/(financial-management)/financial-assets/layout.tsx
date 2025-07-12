import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Revenue & Costing",
};

export default function FinancialAssetsLayout({
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