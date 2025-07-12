import { Metadata } from "next";

export const metadata: Metadata = {
    title: "General",
};

export default function GeneralLayout({
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