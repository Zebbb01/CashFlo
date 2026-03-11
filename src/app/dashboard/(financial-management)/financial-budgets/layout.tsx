import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Budget Planning",
};

export default function FinancialBudgetsLayout({
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
