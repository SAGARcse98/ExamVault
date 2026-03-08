import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "ExamVault — Banking & SSC Prep Platform",
  description: "Your ultimate resource for Banking & SSC exam preparation with video lectures, notes, formulas, and smart tools.",
  keywords: "SSC, Banking, Exam Preparation, IBPS, SBI, RRB, Quantitative Aptitude, Reasoning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
