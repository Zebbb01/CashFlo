import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Withdrawal History & Costs",
};

export default function FinancialWithdrawalsLayout({
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