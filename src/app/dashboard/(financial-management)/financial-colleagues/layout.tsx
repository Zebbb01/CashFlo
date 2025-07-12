import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Colleagues & Financial Contributions",
};

export default function FinancialColleaguesLayout({
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