import type { Metadata } from "next";
import "./global.css";
import { ToastProvider } from "@/components/Toast";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Agenda Pro - Sistema para Autônomos",
  description: "Sistema simples e prático para gerenciar clientes e agendamentos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 min-h-screen">
        <ToastProvider>
          <Navigation />
          <main className="container mx-auto px-4 py-6 max-w-7xl">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}