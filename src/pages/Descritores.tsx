import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { descritores } from '../data/descritores';
import type { Descritor } from '../data/descritores';
import { Search, Loader2, Play, AlertCircle, Cpu, Sparkles, ArrowLeft, BookOpen, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Descritores() {
  const navigate = useNavigate();
  
  // Turmas info
  const [turmas, setTurmas] = useState<any[]>([]);
  const [turmaGeralSelecionada, setTurmaGeralSelecionada] = useState<any>(null);
  
  // Busca na coluna direita
  const [busca, setBusca] = useState('');
  
  // Modal de geração
  const [modalAberto, setModalAberto] = useState(false);
  const [descritorSelecionado, setDescritorSelecionado] = useState<Descritor | null>(null);
  const [cargaHoraria, setCargaHoraria] = useState('2');
  const [apenasEstudo, setApenasEstudo] = useState(false);
  
  // Loading animado
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    supabase.from('turmas').select('*').order('ano', { ascending: true }).then(({ data }) => {
      if (data) setTurmas(data);
    });
  }, []);

  // Filtro de descritores (somente visível após selecionar turma)
  const descritoresFiltrados = turmaGeralSelecionada ? descritores.filter(d => {
    const matchBusca = d.codigo.toLowerCase().includes(busca.toLowerCase()) || d.nome.toLowerCase().includes(busca.toLowerCase());
    const matchDisciplina = d.disciplina === turmaGeralSelecionada.disciplina;
    const matchAno = d.anos.includes(parseInt(turmaGeralSelecionada.ano));
    return matchBusca && matchDisciplina && matchAno;
  }) : [];

  const abrirModalGeração = (descritor: Descritor) => {
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
    
    // Animação de mensagens (agora inclui menção à BNCC na UI)
    const mensagens = [
      "Analisando perfil da turma...",
      "Consultando princípios pedagógicos...",
      "Buscando exemplos no banco de excelência...",
      "Estruturando roteiro e alinhavando com a BNCC...", // Mudamos a mensagem aqui
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
      
      // Buscar banco excelência do descritor (ou da disciplina se não tiver específico)
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
          uso_apenas_estudo: apenasEstudo // Informamos a IA se quiser adaptar a linguagem, ou apenas salva no DB
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      
      // Update usage_type behind the scenes if needed - wait, this might be handled in Edge Function or a secondary update.
      if (apenasEstudo) {
         // Opcional: já marcaremos no banco via update na tabela lesson_plans/planos_gerados
         await supabase.from('planos_gerados').update({ usage_type: 'apenas_estudo' }).eq('id', data.plano_id);
      } else {
         await supabase.from('planos_gerados').update({ usage_type: 'aula_ministrada' }).eq('id', data.plano_id);
      }

      clearInterval(interval);
      navigate(`/plano/${data.plano_id}`);

    } catch (error: any) {
      console.error(error);
      clearInterval(interval);
      setErro('Erro do Servidor/IA: ' + (error.message || JSON.stringify(error)));
      setLoading(false);
    }
  };

  // Funções para Mock do Plano Anual (Aviso incluído na UI)
  const getMockCurriculo = () => {
    return [
      { bimestre: '1º Bimestre', topicos: ['Nivelamento e Revisão', 'Introdução às competências base'] },
      { bimestre: '2º Bimestre', topicos: ['Aprofundamento', 'Resolução de problemas práticos'] }
    ];
  };

  const getMockDesafio = () => {
    // Pegando até 4 descritores aleatórios da disciplina correspondente para simular o que caiu no desafio
    return descritores
      .filter(d => d.disciplina === turmaGeralSelecionada?.disciplina && d.anos.includes(parseInt(turmaGeralSelecionada?.ano)))
      .slice(0, 4);
  };

  if (!turmaGeralSelecionada) {
    return (
      <div className="fade-in space-y-6 pb-20">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Gerador de Planos de Aula
          </h1>
          <p className="text-sm text-text-muted mt-1">Selecione uma turma para carregar o contexto anual e o Desafio Paraná antes de gerar um plano.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
          {turmas.map(t => (
            <div 
              key={t.id} 
              onClick={() => setTurmaGeralSelecionada(t)}
              className="card cursor-pointer flex flex-col justify-between hover:border-primary transition-colors hover:shadow-md"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="badge badge-blue">{t.ano}º Ano {t.turma}</span>
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{t.disciplina}</span>
                </div>
                <h3 className="font-bold text-lg mb-1">{t.nome}</h3>
                <p className="text-sm text-text-muted mb-4">{t.escola}</p>
              </div>
              <div className="pt-4 border-t border-border flex items-center justify-between">
                 <button className="btn btn-primary w-full shadow-sm text-sm">
                   Selecionar Turma
                 </button>
              </div>
            </div>
          ))}
          {turmas.length === 0 && (
             <div className="text-center text-text-muted col-span-full py-10">Carrregando turmas...</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in space-y-6 pb-20 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
      <div className="flex items-center gap-4 shrink-0">
        <button 
          onClick={() => setTurmaGeralSelecionada(null)}
          className="p-2 hover:bg-bg rounded-lg bg-surface border border-border transition-colors text-text-muted hover:text-text"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Visão Geral - {turmaGeralSelecionada.nome}
          </h1>
          <p className="text-sm text-text-muted mt-1">Contexto curricular e seleção de descritores.</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 px-1">
        
        {/* COLUNA ESQUERDA: Visão do Curriculo (Plano Anual + Desafio Paraná) */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-10 custom-scrollbar">
          
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm text-primary flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p><strong>Nota (Anotação de Dev):</strong> Os dados de Plano Anual nesta aba são provisórios (Mock). No futuro, integraremos com as novas tabelas no Supabase.</p>
          </div>

          {/* Card do Plano Anual */}
          <div className="card space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">Plano Anual ({turmaGeralSelecionada.disciplina})</h3>
            </div>
            
            <div className="space-y-4">
              {getMockCurriculo().map((item, idx) => (
                <div key={idx} className="border border-border/50 rounded-lg p-3 bg-bg/50">
                  <h4 className="font-bold text-sm text-text mb-2">{item.bimestre}</h4>
                  <ul className="space-y-1">
                    {item.topicos.map((topico, i) => (
                      <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                        {topico}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Card Desafio Paraná */}
          <div className="card space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <h3 className="font-bold text-lg">Destaques Desafio Paraná</h3>
            </div>
            <p className="text-xs text-text-muted mb-2">Descritores recomendados baseados na última avaliação estadual:</p>
            <div className="flex flex-col gap-2">
              {getMockDesafio().map(d => (
                 <div key={d.codigo} className="border border-green-500/20 bg-green-500/5 rounded p-3">
                   <span className="text-xs font-bold text-green-600 block mb-1">{d.codigo}</span>
                   <p className="text-sm font-medium">{d.nome}</p>
                 </div>
              ))}
            </div>
          </div>

        </div>

        {/* COLUNA DIREITA: Geração de Aula / Matriz Priorizada */}
        <div className="flex flex-col overflow-hidden bg-surface rounded-xl border border-border shadow-sm">
          <div className="p-5 border-b border-border bg-bg shrink-0">
            <h3 className="font-bold text-lg mb-3">Matriz Priorizada - Etapa de Seleção</h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text" 
                placeholder="Buscar descritor para trabalhar (ex: D36)..." 
                className="form-input pl-9"
                value={busca}
                onChange={e => setBusca(e.target.value)}
              />
            </div>
          </div>
          
          <div className="p-5 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
            {descritoresFiltrados.map(desc => (
              <div key={desc.codigo} className="card-sm flex flex-col md:flex-row items-start md:items-center justify-between hover:border-primary transition-all group gap-4 cursor-pointer" onClick={() => abrirModalGeração(desc)}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-purple font-mono">{desc.codigo}</span>
                    <span className="text-xs text-text-muted">{desc.eixo}</span>
                  </div>
                  <h4 className="font-medium text-14 text-text">{desc.nome}</h4>
                </div>
                <button 
                  className="btn btn-ghost w-full md:w-auto text-primary whitespace-nowrap opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Play className="w-4 h-4 mr-1" /> Gerar Plano
                </button>
              </div>
            ))}
            
            {descritoresFiltrados.length === 0 && (
              <div className="text-center py-16 text-text-muted">
                <p>Nenhum descritor encontrado para esta busca na matriz desta série.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modal de Configuração Final (Antes da IA) */}
      {modalAberto && descritorSelecionado && (
        <div className="fixed inset-0 bg-text/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 fade-in">
          <div className="bg-surface rounded-xl max-w-lg w-full p-6 shadow-lg border border-border flex flex-col max-h-[90vh]">
            
            {!loading ? (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold">Configurar Plano Mágico</h2>
                    <p className="text-sm text-text-muted mt-1">Turma: {turmaGeralSelecionada.nome} • Descritor: {descritorSelecionado.codigo}</p>
                  </div>
                  <button onClick={() => setModalAberto(false)} className="text-text-muted hover:text-text">&times;</button>
                </div>

                {erro && (
                  <div className="mb-4 bg-danger-light text-danger p-3 rounded text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{erro}</span>
                  </div>
                )}

                <div className="space-y-6 flex-1 overflow-y-auto">
                  
                  <div>
                    <label className="form-label">Duração da aula</label>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-2 border border-border p-3 rounded-lg flex-1 cursor-pointer hover:border-primary transition-colors">
                        <input type="radio" name="carga" value="1" checked={cargaHoraria === '1'} onChange={e => setCargaHoraria(e.target.value)} />
                        <div>
                          <span className="block font-medium text-sm">1 bloco</span>
                          <span className="text-xs text-text-muted">45 min</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-2 border border-border p-3 rounded-lg flex-1 cursor-pointer hover:border-primary transition-colors">
                        <input type="radio" name="carga" value="2" checked={cargaHoraria === '2'} onChange={e => setCargaHoraria(e.target.value)} />
                        <div>
                          <span className="block font-medium text-sm">2 blocos</span>
                          <span className="text-xs text-text-muted">90 min</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-bg border border-border rounded-lg p-4">
                     <label className="flex items-start gap-3 cursor-pointer">
                       <input 
                         type="checkbox" 
                         className="mt-1 flex-shrink-0" 
                         checked={apenasEstudo} 
                         onChange={(e) => setApenasEstudo(e.target.checked)} 
                       />
                       <div>
                         <span className="block font-bold text-sm text-text">Gerar apenas para meu estudo pessoal</span>
                         <span className="block text-xs text-text-muted mt-1">Marcando esta opção, o sistema não irá cobrar que você registre o desempenho dos alunos na plataforma (pois não haverá aula aplicada).</span>
                       </div>
                     </label>
                  </div>

                </div>

                <div className="mt-8 flex gap-3 pb-1">
                  <button onClick={() => setModalAberto(false)} className="btn btn-ghost flex-1">Cancelar</button>
                  <button onClick={gerarPlano} className="btn btn-purple flex-1 shadow-sm">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Gerar Plano
                  </button>
                </div>
              </>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="relative">
                  <Cpu className="w-12 h-12 text-primary absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
                  <Loader2 className="w-16 h-16 text-primary animate-spin" />
                </div>
                <h3 className="text-lg font-bold mt-6 mb-2">Processando com Inteligência Artificial</h3>
                <p className="text-sm font-medium text-primary animate-pulse transition-all">{loadingMsg}</p>
                <div className="flex gap-1 mt-6">
                  <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
