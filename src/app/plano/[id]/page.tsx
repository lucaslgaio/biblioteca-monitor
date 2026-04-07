import { CheckCircle, Clock } from "lucide-react";

export default async function PlanoDeAulaDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="text-red-500 text-xs font-bold text-center py-2 bg-red-100/10 w-full animate-pulse rounded border border-red-500/20">
         [ MOCKUP ]: O conteúdo deste plano (ID: {resolvedParams.id}) é fictício. O app deve fazer um request à API do Supabase (ou ler via props) pelo plano real gerado pela IA (Gemini) correspondente a esse ID.
      </div>
      
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#002D9C] px-3 py-1 rounded text-sm font-bold text-white border border-[#0F62FE]/50">
                D36
            </span>
            <span className="text-[#0F62FE] font-medium text-sm border border-[#0F62FE]/30 bg-[#0F62FE]/10 px-3 py-1 rounded-full">
                IA Gerou isto
            </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Equações: da balança para a álgebra</h1>
        <p className="text-gray-400">8º ano A • Matemática</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
          <Clock className="w-5 h-5 text-[#0F62FE]" />
          Estrutura da Aula (50 min)
        </h2>
        
        {/* Blocos do Plano */}
        <div className="space-y-4">
           
           <div className="bg-[#0A1A4A] p-5 rounded-xl border border-white/5 relative overflow-hidden">
             <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#198038]"></div>
             <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-white">1. Mobilização (Warm-up)</h3>
                <span className="text-xs font-bold bg-[#001141] text-gray-300 px-2 py-1 rounded border border-white/10">10 min</span>
             </div>
             <p className="text-sm text-gray-300 leading-relaxed mb-4">
               Apresente uma balança de pratos virtual (ou desenhada no quadro) contendo 3 maçãs pesando X e um peso de 15kg do outro lado. Pergunte à turma: "Se a balança está equilibrada, qual o peso de cada maçã?". Deixe-os deduzir antes de usar 'X'.
             </p>
             <div className="bg-[#001141] p-3 rounded text-sm text-gray-400 font-mono border border-white/5">
                {'[Princípio 1] -> Começa por onde o aluno está.'}
             </div>
           </div>

           <div className="bg-[#0A1A4A] p-5 rounded-xl border border-white/5 relative overflow-hidden">
             <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#0F62FE]"></div>
             <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-white">2. Sistematização</h3>
                <span className="text-xs font-bold bg-[#001141] text-gray-300 px-2 py-1 rounded border border-white/10">20 min</span>
             </div>
             <p className="text-sm text-gray-300 leading-relaxed">
               Mostre como a balança equilibrada se traduz para o sinal de "=". Escreva a equação lado a lado com o desenho. Substitua maçãs por 'x'. Ensine que se tirarmos 1 maçã de um prato, precisamos tirar 1 do outro para manter o equilíbrio (Princípio de Equivalência).
             </p>
           </div>

           <div className="bg-[#0A1A4A] p-5 rounded-xl border border-white/5 relative overflow-hidden">
             <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#F1C21B]"></div>
             <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-white">3. Prática Direcionada</h3>
                <span className="text-xs font-bold bg-[#001141] text-gray-300 px-2 py-1 rounded border border-white/10">15 min</span>
             </div>
             <p className="text-sm text-gray-300 leading-relaxed pb-3">
               Entregue a lista de 3 exercícios focados em isolar a incógnita. Exercícios devem ser simples para fixar o método da "balança", sem frações neste momento para não desviar o objetivo principal.
             </p>
             <ul className="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>3x = 12</li>
                <li>2x + 4 = 10</li>
                <li>5x = 2x + 9</li>
             </ul>
           </div>

           <div className="bg-[#0A1A4A] p-5 rounded-xl border border-white/5 relative overflow-hidden">
             <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#DA1E28]"></div>
             <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-white">4. Check-out (Avaliação)</h3>
                <span className="text-xs font-bold bg-[#001141] text-gray-300 px-2 py-1 rounded border border-white/10">5 min</span>
             </div>
             <p className="text-sm text-gray-300 leading-relaxed">
               Peça que cada dupla entregue um "bilhete de saída" respondendo apenas se a equação x + 5 = 12 é equivalente a dizer que x = 7, e justifique usando a metáfora da balança.
             </p>
           </div>

        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#001141] to-transparent pointer-events-none">
         <div className="max-w-3xl mx-auto flex justify-end">
            <button className="bg-[#198038] hover:bg-[#198038]/80 text-white px-8 py-4 rounded-xl font-bold shadow-lg pointer-events-auto flex items-center gap-2 transition-transform hover:-translate-y-1">
               <CheckCircle className="w-5 h-5" />
               Aplicar e Registrar
            </button>
         </div>
      </div>
    </div>
  );
}
