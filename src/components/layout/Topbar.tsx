"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Topbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Planos de Aula" },
    { href: "/descritores", label: "Matriz Priorizada" },
    { href: "/turmas", label: "Turmas" },
    { href: "/banco-excelencia", label: "Banco de Excelência" },
    { href: "/registros", label: "Registro de Aulas" },
  ];

  return (
    <header className="border-b border-white/10 bg-[#001141] sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo Placeholder */}
          <div className="text-white font-bold text-xl tracking-tight">
            <span className="text-[#0F62FE]">Tom</span> Educação
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`py-5 text-sm font-medium transition-colors border-b-2 ${
                    isActive 
                      ? 'text-white border-[#0F62FE]' 
                      : 'text-gray-400 border-transparent hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <button className="text-gray-400 hover:text-white text-sm font-medium" onClick={() => alert("Função de Sair conectada ao Auth")}>
          Sair
        </button>
      </div>
    </header>
  );
}
