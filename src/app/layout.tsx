import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
        <header className="border-b border-white/10 bg-[#001141] sticky top-0 z-50">
           <div className="text-red-500 text-xs font-bold text-center py-2 bg-red-100/10 w-full animate-pulse">
              [ MOCKUP ]: Navbar estática. Links precisam ser dinâmicos (ativo baseado na rota) e o "Sair" precisa chamar o Supabase Auth.
           </div>
           <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-8">
                {/* Logo Placeholder */}
                <div className="text-white font-bold text-xl tracking-tight">
                  <span className="text-[#0F62FE]">Tom</span> Educação
                </div>
                
                <nav className="hidden md:flex items-center gap-6">
                   <Link href="/" className="text-white border-b-2 border-[#0F62FE] py-5 text-sm font-medium">Planos de Aula</Link>
                   <Link href="/descritores" className="text-gray-400 hover:text-white py-5 text-sm font-medium transition-colors">Matriz Priorizada</Link>
                   <Link href="/turmas" className="text-gray-400 hover:text-white py-5 text-sm font-medium transition-colors">Turmas</Link>
                   <Link href="/banco-excelencia" className="text-gray-400 hover:text-white py-5 text-sm font-medium transition-colors">Banco de Excelência</Link>
                   <Link href="/registros" className="text-gray-400 hover:text-white py-5 text-sm font-medium transition-colors">Registro de Aulas</Link>
                </nav>
              </div>

              <button className="text-gray-400 hover:text-white text-sm font-medium">Sair</button>
           </div>
        </header>

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
