import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Grievance Box - Code Manthar AI",
  description: "Professional College Complaint Management System powered by Code Manthar AI",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased bg-navy text-foreground selection:bg-indigo-500/30 selection:text-indigo-200">{children}</body>
    </html>
  );
}