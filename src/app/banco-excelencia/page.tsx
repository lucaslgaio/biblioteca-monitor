import { Quote, Target, Star, Sparkles, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Disable page caching to ensure real-time data

export default async function BancoExcelencia() {
  const { data: princ } = await supabase.from('principios_pedagogicos').select('*').order('numero', { ascending: true });
  const { data: exemp } = await supabase.from('banco_excelencia').select('*').order('num_aplicacoes', { ascending: false });

  const principios = princ || [];
  const casosSucesso = exemp || [];

  return (
    <div className="space-y-12">
      {/* Hero dos Princípios Inegociáveis */}
      <section className="bg-gradient-to-r from-[#001141] to-[#0A1A4A] border border-white/5 p-8 rounded-2xl relative overflow-hidden">
        {/* Tangram / Losangos pattern sutil */}
        <div className="absolute top-0 right-0 opacity-10 blur-[1px]">
          <svg width="400" height="400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
             <polygon points="50,0 100,50 50,100 0,50" fill="#0F62FE" />
          </svg>
        </div>
        
        <div className="bg-[#0A1A4A]/50 border border-white/10 p-4 rounded-xl flex items-start gap-3 shadow-sm mb-8 max-w-4xl">
           <Sparkles className="text-[#0F62FE] w-6 h-6 shrink-0 mt-1" />
           <div>
              <h3 className="font-bold text-white mb-1">Como a IA "pensa"?</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                 Antes de gerar cada plano, a inteligência artificial lê os princípios abaixo rigorosamente. Se a IA sugerir algo vago, ela mesma se corrige para garantir minutagem clara, mobilização antes de conteúdo e limite de um objetivo.
              </p>
           </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white mb-8 relative z-10">Os 5 Princípios Inegociáveis</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {principios.map((p) => (
            <div key={p.id} className="bg-[#001141]/80 backdrop-blur-sm p-6 rounded-xl border-l-4 border-l-[#0F62FE] border border-white/5 space-y-3">
               <div className="text-[#0F62FE] text-4xl font-bold opacity-80">{p.numero}</div>
               <h3 className="font-semibold text-white leading-tight">{p.titulo}</h3>
               <p className="text-sm text-gray-400">{p.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Casos de Sucesso */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Star className="w-6 h-6 text-[#F1C21B] fill-[#F1C21B]" />
          Casos de Sucesso da Rede (Exemplos Injetados na IA)
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {casosSucesso.map((sucesso) => (
              <div key={sucesso.id} className="bg-[#0A1A4A] rounded-xl border border-white/5 p-6 flex flex-col justify-between"
                   style={{ borderLeftColor: sucesso.disciplina === 'matematica' ? '#0F62FE' : '#007D79', borderLeftWidth: '4px' }}>
                <div>
                   <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-2 items-center">
                         <span className="bg-[#001141] border border-white/10 px-2 py-1 rounded text-xs font-bold text-white">{sucesso.codigo_descritor}</span>
                         <span className="text-xs font-semibold bg-[#198038]/20 text-[#198038] px-2 py-1 rounded-full flex items-center gap-1">
                           <Target className="w-3 h-3" /> Aplicado {sucesso.num_aplicacoes}x
                         </span>
                      </div>
                      <span className="text-xs text-gray-400">{sucesso.ano_escolar}º Ano • {sucesso.disciplina === 'matematica' ? 'Matemática' : 'Português'}</span>
                   </div>
                   
                   <h3 className="text-lg font-bold text-white mb-4">{sucesso.titulo}</h3>
                   
                   <div className="bg-[#001141] p-4 rounded-lg relative">
                      <Quote className="absolute top-2 left-2 w-8 h-8 text-[#0F62FE] opacity-20" />
                      <span className="text-xs font-bold text-gray-400 mb-2 uppercase flex items-center gap-1 pl-4">
                        <CheckCircle2 className="w-3 h-3" /> Feedback do Professor
                      </span>
                      <p className="text-sm text-gray-300 italic relative z-10 pl-4">
                         "{sucesso.trecho_feedback}"
                      </p>
                   </div>
                </div>
                
                <div className="mt-4 flex items-center justify-end">
                   <p className="text-xs text-gray-400 font-medium">— {sucesso.avaliado_por}</p>
                </div>
              </div>
           ))}
        </div>
      </section>
    </div>
  );
}
