import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Professional admin dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6 main-content">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}