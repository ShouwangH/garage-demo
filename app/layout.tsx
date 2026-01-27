import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { ToastProvider } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Garage - Fire Apparatus Marketplace",
  description: "Find and save searches for used fire apparatus, ambulances, and rescue vehicles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <ToastProvider>
          <Header />
          <main>{children}</main>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
