import { Clock } from "lucide-react";

export default function RegistrosPage() {
  
  // Dados mockados temporários apenas para esta página
  const history = [
    { id: 1, date: "15 de março, 2026", time: "14:30", turma: "8º ano A", descritor: "D36", recado: "Turma respondeu super bem à dinâmica da balança. O plano foi seguido em sua totalidade.", discipline: "Matemática" },
    { id: 2, date: "14 de março, 2026", time: "09:15", turma: "7º ano A", descritor: "D5", recado: "Não conseguimos finalizar o último bloco devido ao sinal, mas os objetivos de inferência foram atingidos com sucesso.", discipline: "Português" },
    { id: 3, date: "10 de março, 2026", time: "11:00", turma: "6º ano A", descritor: "D18", recado: "Muitos alunos com dúvida na base. Precisei estender o bloco de mobilização.", discipline: "Matemática" },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-red-500 text-xs font-bold text-center py-2 bg-red-100/10 w-full animate-pulse rounded border border-red-500/20">
         [ MOCKUP ]: Timeline conectada a um array temporário da própria página. Para produção, deve ler a tabela "aulas_registradas" ou equivalente no banco, ordenada pela data de registro.
      </div>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Registro de Aulas</h1>
        <p className="text-gray-400">Histórico de planos aplicados e feedback imediato deixado pelos monitores.</p>
      </div>

      <div className="relative border-l-2 border-[#0F62FE]/30 ml-4 md:ml-6 mt-10 space-y-12 pb-10">
        
        {history.map((item, i) => (
          <div key={item.id} className="relative pl-6 md:pl-10">
            {/* Timeline Dot */}
            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-[#001141] ${i === 0 ? 'bg-[#198038]' : 'bg-[#0F62FE]'}`}></div>
            
            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
               {/* Metadata / Time */}
               <div className="w-full md:w-32 flex-shrink-0 pt-0.5">
                 <div className="text-sm font-semibold text-white">{item.date}</div>
                 <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3" />
                    {item.time}
                 </div>
               </div>

               {/* Content Card */}
               <div className="flex-1 bg-[#0A1A4A] p-5 rounded-xl border border-white/5 hover:border-[#0F62FE]/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                     <div>
                       <h3 className="font-bold text-white mb-1"><span className="text-gray-400 font-normal">Turma:</span> {item.turma}</h3>
                       <p className="text-xs text-gray-400">{item.discipline}</p>
                     </div>
                     <span className="bg-[#002D9C] px-2.5 py-1 rounded text-xs font-bold text-white border border-[#0F62FE]/50">
                        {item.descritor}
                     </span>
                  </div>
                  
                  <div className="bg-[#001141] p-3 rounded-lg border border-white/5">
                     <p className="text-sm text-gray-300">
                        "{item.recado}"
                     </p>
                  </div>
               </div>
            </div>
          </div>
        ))}

        {/* End of timeline indicator */}
        <div className="relative pl-6 md:pl-10">
           <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-transparent border-2 border-gray-600"></div>
        </div>

      </div>
    </div>
  );
}
