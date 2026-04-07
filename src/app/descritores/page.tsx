import { turmas } from "@/data/mocks";
import { BookOpen } from "lucide-react";

export default function DescritoresPage() {
  return (
    <div className="space-y-8">
      <div className="text-red-500 text-xs font-bold text-center py-2 bg-red-100/10 w-full animate-pulse rounded border border-red-500/20">
         [ MOCKUP ]: Essa tela de "Matriz Priorizada" carrega os dados mockados no contexto; futuramente, clicar em "Selecionar Turma" deve alimentar o estado global/cookie para filtrar as próximas interações e carregar dados do Desafio Paraná.
      </div>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Matriz Priorizada</h1>
        <p className="text-gray-400">Selecione uma turma para analisar seus descritores e carregar o contexto anual (Desafio Paraná).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {turmas.map((turma) => (
          <div key={turma.id} className="bg-[#0A1A4A] p-6 rounded-xl border border-white/5 hover:border-[#0F62FE] transition-colors flex flex-col justify-between group">
             <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#002D9C]/50 p-3 rounded-lg">
                    <BookOpen className="w-6 h-6 text-[#0F62FE]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white">{turma.name}</h3>
                    <p className="text-sm text-gray-400">{turma.discipline}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-6">{turma.school}</p>
             </div>
             
             <button className="w-full bg-[#001141] hover:bg-[#002D9C] border border-[#0F62FE]/30 text-white p-3 rounded-lg font-medium transition-colors group-hover:border-[#0F62FE]">
                Selecionar Turma
             </button>
          </div>
        ))}
      </div>
    </div>
  );
}
