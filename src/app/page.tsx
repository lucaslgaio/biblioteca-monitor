"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Zap, LayoutGrid, AlertCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [turmas, setTurmas] = useState<any[]>([]);
  const [desempenho, setDesempenho] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // Carregar turmas
      const { data: turmasData } = await supabase.from('turmas').select('*');
      if (turmasData) setTurmas(turmasData);

      // Carregar desempenho
      const { data: desempenhoData } = await supabase
        .from('desempenho_descritores')
        .select('*');
      if (desempenhoData) setDesempenho(desempenhoData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const desempenhoTurmaAtual = turmaSelecionada
    ? desempenho.filter(d => d.turma_id === turmaSelecionada).sort((a, b) => a.percentual_acerto - b.percentual_acerto)
    : [];

  const getBadgeColor = (percentual: number) => {
    if (percentual < 50) return 'bg-[#DA1E28] text-white'; // Vermelho
    if (percentual <= 70) return 'bg-[#F1C21B] text-black'; // Amarelo
    return 'bg-[#198038] text-white'; // Verde
  };

  return (
    <div className="space-y-8">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Planos de Aula</h1>
          <p className="text-gray-400">Gere e gerencie novos planos adaptados para a defasagem real.</p>
        </div>
        <button 
          onClick={() => router.push('/descritores')}
          className="bg-[#0F62FE] hover:bg-[#002D9C] text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-[0_4px_14px_0_rgba(15,98,254,0.39)]"
        >
          <Zap className="w-5 h-5" />
          Gerar Novo Plano
          <span className="ml-2 text-white/60 text-xs bg-black/20 px-1.5 py-0.5 rounded">G</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Esquerda: Filtros e Turmas */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-[#0A1A4A] p-5 rounded-xl border border-white/5 space-y-4">
             <div className="flex items-center justify-between">
                 <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
                    <LayoutGrid className="w-5 h-5 text-[#0F62FE]" />
                    Turmas Ativas
                 </h2>
                 {loading && <RefreshCw className="w-4 h-4 text-[#0F62FE] animate-spin" />}
             </div>
             
             <div className="space-y-3">
               {turmas.map((t) => (
                 <div 
                    key={t.id} 
                    onClick={() => setTurmaSelecionada(t.id)}
                    className={`p-3 border rounded-lg transition-colors cursor-pointer group ${turmaSelecionada === t.id ? 'bg-[#002D9C]/30 border-[#0F62FE]' : 'border-white/5 hover:border-[#0F62FE]/50 bg-[#001141]/50'}`}
                 >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-white group-hover:text-[#0F62FE] transition-colors">{t.nome}</span>
                      <span className="text-[10px] bg-[#001141] text-[#0F62FE] px-2 py-0.5 rounded-full font-medium border border-white/10">
                        {t.ano}º Ano
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 capitalize">{t.disciplina} • {t.escola}</p>
                 </div>
               ))}
               {turmas.length === 0 && !loading && (
                  <p className="text-sm text-gray-400 text-center py-4">Nenhuma turma encontrada no banco.</p>
               )}
             </div>
           </div>
        </div>

        {/* Canto Direito: Mapa e Lista */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Mapa Dinâmico do Banco */}
          <div className="bg-[#0A1A4A] p-6 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-semibold text-white">
                 Mapa de Defasagem {turmaSelecionada ? `- ${turmas.find(t=>t.id === turmaSelecionada)?.nome}` : ''}
               </h2>
               {turmaSelecionada && desempenhoTurmaAtual.length > 0 && (
                 <span className="text-xs font-bold px-2 py-1 bg-[#198038]/20 text-[#198038] rounded border border-[#198038]/30">
                    Sincronizado com Desafio Paraná
                 </span>
               )}
            </div>
            
            {!turmaSelecionada ? (
                <div className="text-center py-12 text-gray-400 flex flex-col items-center">
                   <AlertCircle className="w-8 h-8 opacity-50 mb-2" />
                   <p>Selecione uma turma ao lado para visualizar o mapa de habilidades.</p>
                </div>
            ) : desempenhoTurmaAtual.length === 0 ? (
                <div className="text-center py-12 text-gray-400 flex flex-col items-center">
                   <AlertCircle className="w-8 h-8 opacity-50 mb-2" />
                   <p>Não há dados de proficiência para a turma selecionada.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {desempenhoTurmaAtual.map((d) => (
                        <div 
                            key={d.id} 
                            onClick={() => router.push(`/descritores?turma=${turmaSelecionada}&descritor=${d.codigo_descritor}`)} 
                            title={`${d.nome_descritor} (${d.percentual_acerto}% acerto)`}
                            className={`
                                aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform hover:shadow-lg
                                ${getBadgeColor(d.percentual_acerto)}
                            `}
                        >
                            <span className="font-bold text-lg leading-none">{d.codigo_descritor}</span>
                            <span className="text-[10px] opacity-80 mt-1 font-medium">{d.percentual_acerto}%</span>
                        </div>
                    ))}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-6 text-sm text-gray-300 border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#198038]"></span> Consolidado (&gt;70%)</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#F1C21B]"></span> Em desenvolvimento (50-70%)</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#DA1E28]"></span> Defasagem grave (&lt;50%)</div>
                    </div>
                </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
