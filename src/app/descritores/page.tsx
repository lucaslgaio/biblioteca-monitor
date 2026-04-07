"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { descritores } from '@/data/descritores';
import { Search, Loader2, Play, AlertCircle, Cpu, Sparkles, ArrowLeft, BookOpen, AlertTriangle, CheckCircle2 } from 'lucide-react';

function DescritoresContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Turmas info
  const [turmas, setTurmas] = useState<any[]>([]);
  const [turmaGeralSelecionada, setTurmaGeralSelecionada] = useState<any>(null);
  
  // Busca na coluna direita
  const [busca, setBusca] = useState('');
  
  // Modal de geração
  const [modalAberto, setModalAberto] = useState(false);
  const [descritorSelecionado, setDescritorSelecionado] = useState<any | null>(null);
  const [cargaHoraria, setCargaHoraria] = useState('2');
  const [apenasEstudo, setApenasEstudo] = useState(false);
  
  // Loading animado
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    supabase.from('turmas').select('*').order('ano', { ascending: true }).then(({ data }) => {
      if (data) {
        setTurmas(data);
        const turmaIdUrl = searchParams.get('turma');
        if (turmaIdUrl) {
           const turma = data.find(t => t.id === turmaIdUrl);
           if (turma) {
             setTurmaGeralSelecionada(turma);
             const code = searchParams.get('descritor');
             if(code) {
                const desc = descritores.find(d => d.codigo === code);
                if (desc) {
                   setBusca(code);
                }
             }
           }
        }
      }
    });
  }, [searchParams]);

  // Filtro de descritores (somente visível após selecionar turma)
  const descritoresFiltrados = turmaGeralSelecionada ? descritores.filter(d => {
    const matchBusca = d.codigo.toLowerCase().includes(busca.toLowerCase()) || d.nome.toLowerCase().includes(busca.toLowerCase());
    const matchDisciplina = d.disciplina === turmaGeralSelecionada.disciplina;
    const matchAno = d.anos.includes(parseInt(turmaGeralSelecionada.ano));
    return matchBusca && matchDisciplina && matchAno;
  }) : [];

  const abrirModalGeração = (descritor: any) => {
    setDescritorSelecionado(descritor);
    setApenasEstudo(false); // Reseta a flag
    setModalAberto(true);
    setErro('');
  };

  const gerarPlano = async () => {
    if (!turmaGeralSelecionada || !descritorSelecionado) {
      setErro('Selecione uma turma para continuar.');
      return;
    }

    setLoading(true);
    setErro('');
    
    // Animação de mensagens
    const mensagens = [
      "Analisando perfil da turma...",
      "Consultando princípios pedagógicos...",
      "Buscando exemplos no banco de excelência...",
      "Estruturando roteiro e alinhavando com a BNCC...",
      "Finalizando plano de aula prático..."
    ];
    
    let step = 0;
    setLoadingMsg(mensagens[0]);
    
    const interval = setInterval(() => {
      step++;
      if (step < mensagens.length) {
        setLoadingMsg(mensagens[step]);
      }
    }, 2000);

    try {
      // Buscar desempenho da turma se existir
      const { data: desempList } = await supabase
        .from('desempenho_descritores')
        .select('percentual_acerto')
        .eq('turma_id', turmaGeralSelecionada.id)
        .eq('codigo_descritor', descritorSelecionado.codigo)
        .maybeSingle();
        
      const percentualAcerto = desempList ? desempList.percentual_acerto : 50;

      // Buscar princípios
      const { data: prinData } = await supabase.from('principios_pedagogicos').select('*');
      
      // Buscar banco excelência do descritor
      const { data: excData } = await supabase
        .from('banco_excelencia')
        .select('*')
        .eq('codigo_descritor', descritorSelecionado.codigo)
        .limit(2);

      // Chamar Edge Function que interage com Gemini
      const { data, error } = await supabase.functions.invoke('gerar-plano-aula', {
        body: {
          turma_id: turmaGeralSelecionada.id,
          codigo_descritor: descritorSelecionado.codigo,
          nome_descritor: descritorSelecionado.nome,
          ano_escolar: turmaGeralSelecionada.ano,
          disciplina: descritorSelecionado.disciplina,
          carga_horaria: parseInt(cargaHoraria),
          percentual_acerto_turma: percentualAcerto,
          principios_pedagogicos: prinData || [],
          exemplos_banco_excelencia: excData || [],
          uso_apenas_estudo: apenasEstudo
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      if (apenasEstudo) {
         await supabase.from('planos_gerados').update({ usage_type: 'apenas_estudo' }).eq('id', data.plano_id);
      } else {
         await supabase.from('planos_gerados').update({ usage_type: 'aula_ministrada' }).eq('id', data.plano_id);
      }

      clearInterval(interval);
      router.push(`/plano/${data.plano_id}`);

    } catch (error: any) {
      console.error(error);
      clearInterval(interval);
      setErro('Erro do Servidor/IA: ' + (error.message || JSON.stringify(error)));
      setLoading(false);
    }
  };

  const getMockCurriculo = () => {
    return [
      { bimestre: '1º Bimestre', topicos: ['Nivelamento e Revisão', 'Introdução às competências base'] },
      { bimestre: '2º Bimestre', topicos: ['Aprofundamento', 'Resolução de problemas práticos'] }
    ];
  };

  const getMockDesafio = () => {
    return descritores
      .filter(d => d.disciplina === turmaGeralSelecionada?.disciplina && d.anos.includes(parseInt(turmaGeralSelecionada?.ano)))
      .slice(0, 4);
  };

  if (!turmaGeralSelecionada) {
    return (
      <div className="space-y-6 pb-20">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Matriz Priorizada & Geração
          </h1>
          <p className="text-gray-400">Selecione uma turma para carregar o contexto anual e o Desafio Paraná antes de gerar um plano.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
          {turmas.map(t => (
            <div 
              key={t.id} 
              onClick={() => setTurmaGeralSelecionada(t)}
              className="bg-[#0A1A4A] border border-white/5 p-6 rounded-xl cursor-pointer flex flex-col justify-between hover:border-[#0F62FE]/50 hover:bg-[#0A1A4A]/80 transition-all shadow-sm group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-[#001141] border border-white/10 px-3 py-1 rounded-md text-sm font-bold text-[#0F62FE]">{t.ano}º Ano {t.turma}</span>
                  <span className="text-xs font-bold text-gray-400 bg-white/5 px-2 py-1 rounded-full">{t.disciplina}</span>
                </div>
                <h3 className="font-bold text-xl text-white mb-1 group-hover:text-[#0F62FE] transition-colors">{t.nome}</h3>
                <p className="text-sm text-gray-400 capitalize mb-6">{t.escola}</p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-center">
                 <span className="text-sm font-medium text-[#0F62FE] flex items-center gap-1 group-hover:gap-2 transition-all">
                   Acessar Matriz da Turma &rarr;
                 </span>
              </div>
            </div>
          ))}
          {turmas.length === 0 && (
             <div className="text-center text-gray-500 col-span-full py-20 flex flex-col items-center">
                 <Loader2 className="w-8 h-8 animate-spin mb-4" />
                 Carregando turmas oficiais...
             </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 flex flex-col" style={{ minHeight: 'calc(100vh - 120px)' }}>
      <div className="flex items-center gap-4 shrink-0 bg-[#0A1A4A] p-4 rounded-xl border border-white/5">
        <button 
          onClick={() => {
              setTurmaGeralSelecionada(null);
              setBusca('');
          }}
          className="p-2 hover:bg-[#001141] rounded-lg border border-white/10 transition-colors text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2 text-white">
            Visão Geral Curricular - <span className="text-[#0F62FE]">{turmaGeralSelecionada.nome}</span>
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Selecione o descritor na matriz ({turmaGeralSelecionada.disciplina}) para a Inteligência Artificial gerar o plano.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 px-1 h-full">
        
        {/* COLUNA ESQUERDA: Visão do Curriculo (Plano Anual + Desafio Paraná) */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#0F62FE]/10 border border-[#0F62FE]/20 rounded-lg p-4 text-sm text-[#8aadeff0]">
            <strong>Sincronização Ativa:</strong> Os dados do plano anual e Desafio Paraná condicionam os princípios inegociáveis.
          </div>

          <div className="bg-[#0A1A4A] rounded-xl border border-white/5 p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <BookOpen className="w-5 h-5 text-[#0F62FE]" />
              <h3 className="font-bold text-lg text-white">Plano Anual</h3>
            </div>
            
            <div className="space-y-4">
              {getMockCurriculo().map((item, idx) => (
                <div key={idx} className="border border-white/5 rounded-lg p-4 bg-[#001141]">
                  <h4 className="font-bold text-sm text-white mb-2">{item.bimestre}</h4>
                  <ul className="space-y-2">
                    {item.topicos.map((topico, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0F62FE] mt-1.5 shrink-0" />
                        {topico}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0A1A4A] rounded-xl border border-white/5 p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <CheckCircle2 className="w-5 h-5 text-[#198038]" />
              <h3 className="font-bold text-lg text-white">Destaques Desafio Paraná</h3>
            </div>
            <div className="flex flex-col gap-3">
              {getMockDesafio().map(d => (
                 <div key={d.codigo} className="border border-[#198038]/20 bg-[#198038]/10 rounded-lg p-4">
                   <span className="text-xs font-bold text-[#198038] mb-1 block">{d.codigo}</span>
                   <p className="text-sm font-medium text-white">{d.nome}</p>
                 </div>
              ))}
            </div>
          </div>

        </div>

        {/* COLUNA DIREITA: Matriz Priorizada e Busca */}
        <div className="bg-[#0A1A4A] rounded-xl border border-white/5 flex flex-col h-full max-h-[800px]">
          <div className="p-6 border-b border-white/10 shrink-0">
            <h3 className="font-bold text-lg text-white mb-4">Matriz Priorizada</h3>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar descritor para gerar aula (ex: D36)..." 
                className="w-full bg-[#001141] border border-white/10 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#0F62FE] transition-colors placeholder:text-gray-500"
                value={busca}
                onChange={e => setBusca(e.target.value)}
              />
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
            {descritoresFiltrados.map(desc => (
              <div 
                 key={desc.codigo} 
                 className="bg-[#001141]/50 border border-white/5 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between hover:border-[#0F62FE] hover:bg-[#001141] transition-all group gap-4 cursor-pointer" 
                 onClick={() => abrirModalGeração(desc)}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#0F62FE]/20 text-[#0F62FE] px-2 py-0.5 rounded text-xs font-bold">{desc.codigo}</span>
                    <span className="text-xs text-gray-400">{desc.eixo}</span>
                  </div>
                  <h4 className="font-medium text-sm text-white">{desc.nome}</h4>
                </div>
                <button 
                  className="bg-[#0F62FE] hover:bg-[#002D9C] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center shrink-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                >
                  <Play className="w-4 h-4 mr-2" /> Gerar Plano
                </button>
              </div>
            ))}
            
            {descritoresFiltrados.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                O descritor pesquisado não pertence a esta matriz.
              </div>
            )}
          </div>
        </div>

      </div>

      {modalAberto && descritorSelecionado && (
        <div className="fixed inset-0 bg-[#001141]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0A1A4A] rounded-2xl max-w-lg w-full p-8 shadow-2xl border border-white/10 flex flex-col">
            
            {!loading ? (
              <>
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Configurar Geração</h2>
                    <p className="text-sm text-gray-400">Turma: <span className="text-white">{turmaGeralSelecionada.nome}</span> • Descritor: <span className="text-[#0F62FE] font-bold">{descritorSelecionado.codigo}</span></p>
                  </div>
                </div>

                {erro && (
                  <div className="mb-6 bg-[#DA1E28]/10 text-[#FF8389] p-4 rounded-xl text-sm flex items-center gap-3 border border-[#DA1E28]/30">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{erro}</span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Duração prevista</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 border p-4 rounded-xl cursor-pointer transition-colors ${cargaHoraria === '1' ? 'border-[#0F62FE] bg-[#0F62FE]/10' : 'border-white/10 hover:border-white/30'}`}>
                        <input className="hidden" type="radio" name="carga" value="1" checked={cargaHoraria === '1'} onChange={e => setCargaHoraria(e.target.value)} />
                        <div>
                          <span className="block font-bold text-white text-lg">1 bloco</span>
                          <span className="text-sm text-gray-400">45 minutos</span>
                        </div>
                      </label>
                      <label className={`flex-1 border p-4 rounded-xl cursor-pointer transition-colors ${cargaHoraria === '2' ? 'border-[#0F62FE] bg-[#0F62FE]/10' : 'border-white/10 hover:border-white/30'}`}>
                        <input className="hidden" type="radio" name="carga" value="2" checked={cargaHoraria === '2'} onChange={e => setCargaHoraria(e.target.value)} />
                        <div>
                          <span className="block font-bold text-white text-lg">2 blocos</span>
                          <span className="text-sm text-gray-400">90 minutos</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-[#001141] border border-white/5 rounded-xl p-5">
                     <label className="flex items-start gap-3 cursor-pointer">
                       <input 
                         type="checkbox" 
                         className="mt-1 w-4 h-4 text-[#0F62FE] rounded border-white/20 bg-bg focus:ring-[#0F62FE] cursor-pointer" 
                         checked={apenasEstudo} 
                         onChange={(e) => setApenasEstudo(e.target.checked)} 
                       />
                       <div>
                         <span className="block font-bold text-sm text-white">Plano teste (apenas estudo)</span>
                         <span className="block text-xs text-gray-400 mt-1">Marque se não for aplicar em sala para não bagunçar os relatórios da coordenação.</span>
                       </div>
                     </label>
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <button onClick={() => setModalAberto(false)} className="px-6 py-3 font-semibold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">Cancelar</button>
                  <button onClick={gerarPlano} className="flex-1 bg-[#0F62FE] hover:bg-[#002D9C] text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(15,98,254,0.39)]">
                    <Sparkles className="w-5 h-5" />
                    Bater o Martelo e Gerar
                  </button>
                </div>
              </>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="relative mb-8">
                  <Cpu className="w-16 h-16 text-[#0F62FE] opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  <Loader2 className="w-20 h-20 text-[#0F62FE] animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Processando com a IA da Tom...</h3>
                <p className="text-sm font-medium text-[#0F62FE] animate-pulse">{loadingMsg}</p>
                <div className="flex gap-2 mt-8">
                  <div className="w-2 h-2 rounded-full bg-[#0F62FE] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[#0F62FE] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[#0F62FE] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DescritoresPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-[#0F62FE]" /></div>}>
      <DescritoresContent />
    </Suspense>
  )
}
