import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Topbar from "@/components/layout/Topbar";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Biblioteca Monitor | Tom Educação",
  description: "Gerador de planos de aula personalizados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn("dark font-sans antialiased", poppins.variable)}>
      <body className="bg-[#001141] text-white min-h-screen flex flex-col">
        
        <Topbar />

        {/* Padrão Geométrico de Fundo (Simples overlay CSS para exemplo) */}
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-5 mix-blend-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/20 via-[#001141] to-[#001141]">
        </div>

        <main className="flex-1 container mx-auto px-4 py-8 relative">
          {children}
        </main>
      </body>
    </html>
  );
}
