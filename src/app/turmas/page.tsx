import { turmas } from "@/data/mocks";
import { Users, Plus, RefreshCw } from "lucide-react";

export default function TurmasPage() {
  return (
    <div className="space-y-8">
      <div className="text-red-500 text-xs font-bold text-center py-2 bg-red-100/10 w-full animate-pulse rounded border border-red-500/20">
         [ MOCKUP ]: A listagem atual está lendo do arquivo `mocks.ts`. O botão "Atualizar Mapa" atualmente não faz nada e precisa invocar a procedure do banco de dados (Supabase) ou revalidar o path (Next.js server actions).
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Turmas</h1>
          <p className="text-gray-400">Gerencie todas as turmas e mantenha seus mapas de defasagem atualizados.</p>
        </div>
        <button className="bg-[#002D9C] hover:bg-[#0F62FE] text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nova Turma
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {turmas.map((turma) => (
          <div key={turma.id} className="bg-[#0A1A4A] p-5 rounded-xl border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-between h-48">
             <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="bg-[#001141] p-2 rounded-lg">
                    <Users className="w-5 h-5 text-[#8A8FA3]" />
                  </div>
                  <span className="text-[10px] bg-[#0F62FE]/20 text-[#0F62FE] px-2 py-0.5 rounded-full font-bold">
                    {turma.appliedPlans} planos aplicados
                  </span>
                </div>
                <h3 className="font-bold text-lg text-white truncate">{turma.name}</h3>
                <p className="text-sm text-gray-400 truncate">{turma.discipline}</p>
                <p className="text-xs text-gray-600 mt-1 truncate">{turma.school}</p>
             </div>
             
             <button className="flex items-center justify-center gap-2 w-full border border-white/10 hover:bg-white/5 text-gray-300 py-2 rounded-lg text-sm font-medium transition-colors">
                <RefreshCw className="w-4 h-4" />
                Atualizar Mapa
             </button>
          </div>
        ))}
      </div>
    </div>
  );
}
