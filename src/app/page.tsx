import { turmas } from "@/data/mocks";
import { Zap, LayoutGrid } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-red-500 text-xs font-bold text-center py-2 bg-red-100/10 w-full animate-pulse rounded border border-red-500/20">
         [ MOCKUP ]: Página conectada a mocks locais (data/mocks.ts). É preciso integrar a chamada para carregar os "Planos Recentes" e o "Mapa de Defasagem" do banco de dados/Supabase.
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Planos de Aula</h1>
          <p className="text-gray-400">Gere e gerencie novos planos adaptados para a defasagem real.</p>
        </div>
        <button className="bg-[#0F62FE] hover:bg-[#002D9C] text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-[0_4px_14px_0_rgba(15,98,254,0.39)]">
          <Zap className="w-5 h-5" />
          Gerar Novo Plano
          <span className="ml-2 text-white/60 text-xs bg-black/20 px-1.5 py-0.5 rounded">G</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Esquerda: Filtros e Turmas */}
        <div className="lg:col-span-1 space-y-6">
           <div className="text-red-500 text-xs font-bold p-2 bg-red-100/10 rounded border border-red-500/20">
             [ MOCKUP ]: Lista de turmas estática. Precisa de lógica de seleção e filtro.
           </div>
           
           <div className="bg-[#0A1A4A] p-5 rounded-xl border border-white/5 space-y-4">
             <h2 className="text-lg font-semibold flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-[#0F62FE]" />
                Turmas Ativas
             </h2>
             
             <div className="space-y-3">
               {turmas.map((t) => (
                 <div key={t.id} className="p-3 border border-white/5 rounded-lg hover:border-[#0F62FE]/50 transition-colors cursor-pointer bg-[#001141]/50 group">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-white group-hover:text-[#0F62FE] transition-colors">{t.name}</span>
                      <span className="text-[10px] bg-[#0F62FE]/20 text-[#0F62FE] px-2 py-0.5 rounded-full font-medium">
                        {t.appliedPlans} aplicados
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{t.discipline} • {t.school}</p>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* Canto Direito: Mapa e Lista */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Mapa Mockado */}
          <div className="bg-[#0A1A4A] p-6 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-semibold">Mapa de Defasagem Estimado</h2>
               <div className="text-red-500 text-xs font-bold px-2 py-1 bg-red-100/10 rounded border border-red-500/20">
                 [ MOCKUP ]: Retificar matriz via integração com Desafio Paraná/Supabase
               </div>
            </div>
            
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
               {['D1', 'D2', 'D5', 'D6', 'D10', 'D11', 'D15', 'D18', 'D22', 'D25', 'D30', 'D36'].map((d, i) => (
                  <div key={d} className={`
                    aspect-square rounded-lg flex items-center justify-center font-bold text-lg cursor-help
                    ${i % 4 === 0 ? 'bg-[#198038] text-white' : i % 3 === 0 ? 'bg-[#DA1E28] text-white' : 'bg-[#F1C21B] text-black'}
                  `}>
                    {d}
                  </div>
               ))}
            </div>
            
            <div className="flex items-center gap-4 mt-6 text-sm">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#198038]"></span> Consolidado</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#F1C21B]"></span> Em desenvolvimento</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#DA1E28]"></span> Defasagem grave</div>
            </div>
          </div>

          <div className="text-center py-12 border border-dashed border-white/20 rounded-xl bg-[#0A1A4A]/50">
             <div className="text-red-500 text-xs font-bold p-2 mx-auto w-max mb-4 bg-red-100/10 rounded border border-red-500/20">
                [ MOCKUP ]: Empty State — Aguardando geração de dados. Precisa ligar à listagem de Supabase.
             </div>
             <p className="text-gray-400">Nenhum plano gerado para a turma selecionada.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
