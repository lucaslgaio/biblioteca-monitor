import { principios, casosSucesso } from "@/data/mocks";
import { Quote, Target } from "lucide-react";

export default function BancoExcelencia() {
  return (
    <div className="space-y-12">
      <div className="text-red-500 text-xs font-bold text-center py-2 bg-red-100/10 w-full animate-pulse rounded border border-red-500/20">
         [ MOCKUP ]: Casos de Sucesso estão vindo de mock local. Precisam ser conectados com uma busca real ao banco de dados onde os professores logam seus feedbacks.
      </div>

      {/* Hero dos Princípios Inegociáveis */}
      <section className="bg-gradient-to-r from-[#001141] to-[#0A1A4A] border border-white/5 p-8 rounded-2xl relative overflow-hidden">
        {/* Tangram / Losangos pattern sutil */}
        <div className="absolute top-0 right-0 opacity-10 blur-[1px]">
          <svg width="400" height="400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
             <polygon points="50,0 100,50 50,100 0,50" fill="#0F62FE" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-white mb-8 relative z-10">Os 5 Princípios Inegociáveis</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {principios.map((p, index) => (
            <div key={p.id} className="bg-[#001141]/80 backdrop-blur-sm p-6 rounded-xl border-l-4 border-l-[#0F62FE] border border-white/5 space-y-3">
               <div className="text-[#0F62FE] text-4xl font-bold opacity-80">{p.id}</div>
               <h3 className="font-semibold text-white leading-tight">{p.title}</h3>
               <p className="text-sm text-gray-400">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Casos de Sucesso */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-[#198038]" />
          Casos de Sucesso Recentes
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {casosSucesso.map((sucesso) => (
              <div key={sucesso.id} className="bg-[#0A1A4A] rounded-xl border border-white/5 p-6 flex flex-col justify-between"
                   style={{ borderLeftColor: sucesso.discipline === 'Matemática' ? '#0F62FE' : '#007D79', borderLeftWidth: '4px' }}>
                <div>
                   <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-2 items-center">
                         <span className="bg-[#001141] border border-white/10 px-2 py-1 rounded text-xs font-bold text-white">{sucesso.descritor}</span>
                         <span className="text-xs font-semibold bg-[#198038]/20 text-[#198038] px-2 py-1 rounded-full">
                           Aplicado {sucesso.appliedCount}x
                         </span>
                      </div>
                      <span className="text-xs text-gray-400">{sucesso.grade} • {sucesso.discipline}</span>
                   </div>
                   
                   <h3 className="text-lg font-bold text-white mb-4">{sucesso.title}</h3>
                   
                   <div className="bg-[#001141] p-4 rounded-lg relative">
                      <Quote className="absolute top-2 left-2 w-8 h-8 text-[#0F62FE] opacity-20" />
                      <p className="text-sm text-gray-300 italic relative z-10 pl-4">
                         "{sucesso.feedback}"
                      </p>
                   </div>
                </div>
                
                <div className="mt-4 flex items-center justify-end">
                   <p className="text-xs text-gray-400 font-medium">— {sucesso.author}</p>
                </div>
              </div>
           ))}
        </div>
      </section>
    </div>
  );
}
