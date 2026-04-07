import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Printer, CheckCircle, ArrowLeft, Lightbulb, Clock, BookOpen, AlertTriangle, PlayCircle, Save, X, Sparkles } from 'lucide-react';

export default function PlanoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [planoRaw, setPlanoRaw] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // States para o Registro Rápido (30s)
  const [modalRegistro, setModalRegistro] = useState(false);
  const [notasAula, setNotasAula] = useState('');
  const [salvandoRegistro, setSalvandoRegistro] = useState(false);
  const [registroFeito, setRegistroFeito] = useState(false);
  const [forcarRegistro, setForcarRegistro] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const { data, error } = await supabase
          .from('planos_gerados')
          .select('*, turmas(nome, disciplina, ano)')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setPlanoRaw(data);

        // Verifica se a aula foi ministrada e se já possui registro
        if (data.usage_type !== 'apenas_estudo') {
           // Tenta buscar o registro
           const { data: logData, error: logErr } = await supabase
             .from('class_logs')
             .select('id')
             .eq('lesson_plan_id', id)
             .maybeSingle();

           if (!logErr && logData) {
             setRegistroFeito(true);
           } else {
             // Se não encontrou registro e a aula devia ter sido registrada, forçamos o modal a abrir
             setModalRegistro(true);
             setForcarRegistro(true);
           }
        } else {
           // Apenas estudo, não precisa registrar
           setRegistroFeito(true);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [id]);

  const salvarRegistro = async () => {
    if (!notasAula.trim()) return;
    setSalvandoRegistro(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('class_logs').insert({
        lesson_plan_id: id,
        class_identifier: planoRaw.turmas?.nome || 'Desconhecida',
        monitor_id: userData.user?.id,
        notes: notasAula
      });

      if (error) throw error;
      
      setRegistroFeito(true);
      setModalRegistro(false);
      setForcarRegistro(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar o registro da aula.');
    } finally {
      setSalvandoRegistro(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="spinner !w-8 !h-8 border-[3px]" />
      </div>
    );
  }

  if (!planoRaw) {
    return <div className="text-center py-20">Plano não encontrado.</div>;
  }

  const { titulo, finalidade, habilidade_bncc, objetos_conhecimento, objetivos_aprendizagem, 
          competencias_gerais, duracao_total_minutos, etapas, atividade_desafio_parana, 
          materiais_apoio, adaptacoes, como_avaliar } = planoRaw.conteudo_json || {};

  return (
    <div className="fade-in max-w-4xl mx-auto pb-20">
      {/* Botões do Topo */}
      <div className="flex gap-4 justify-between items-center mb-6 print:hidden">
        <button onClick={() => navigate(-1)} className="btn btn-ghost !px-2">
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="btn btn-ghost">
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          {!registroFeito && (
            <button onClick={() => setModalRegistro(true)} className="btn btn-primary bg-primary text-white">
              <CheckCircle className="w-4 h-4" />
              Registrar Aula
            </button>
          )}
          {registroFeito && planoRaw.usage_type !== 'apenas_estudo' && (
            <button disabled className="btn btn-ghost text-green-600 bg-green-50 border-green-200">
              <CheckCircle className="w-4 h-4" />
              Aula Registrada
            </button>
          )}
        </div>
      </div>

      {/* Cabeçalho */}
      <div className="bg-surface border border-border rounded-t-xl p-8 shadow-sm">
        <div className="flex flex-wrap gap-2 mb-4 justify-between items-start">
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-purple">{planoRaw.codigo_descritor}</span>
            <span className="badge badge-blue">{planoRaw.turmas?.nome}</span>
            <span className="badge bg-surface border-border text-text-muted">
              <Clock className="w-3 h-3 mr-1 inline" /> {duracao_total_minutos} min
            </span>
          </div>
          {/* Badge de Verificação BNCC */}
          <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-200 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 fill-green-500 text-green-500" />
            Estruturado com base na BNCC
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-3 text-text leading-tight">{titulo}</h1>
        <p className="text-lg text-text-muted mb-6">{finalidade}</p>

        <div className="flex flex-wrap gap-x-8 gap-y-4 pt-4 border-t border-border">
          <div>
             <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-1">Cód. Habilidade BNCC</span>
             <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded inline-block">{habilidade_bncc || 'Não informado'}</span>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-1">Objetivos ({objetivos_aprendizagem?.length || 0})</span>
            <ul className="text-sm">
              {objetivos_aprendizagem?.map((obj: string, i: number) => <li key={i}>• {obj}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {planoRaw.usage_type === 'apenas_estudo' && (
         <div className="bg-blue-50 text-blue-800 p-4 border border-blue-200 flex items-center gap-3">
           <BookOpen className="w-5 h-5 text-blue-500 shrink-0" />
           <p className="text-sm">Este material foi gerado com a marcação <strong>Apenas Estudo</strong>, portanto não exige um registro de aplicação na turma.</p>
         </div>
      )}

      {/* Restante da Timeline de forma inalterada */}
      {/* Sugestão Desafio Paraná */}
      {atividade_desafio_parana && (
        <div className="bg-success-light border border-[#a8d07a] rounded-b-xl p-5 border-t-0 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="font-bold text-success mb-1">Integração com o Desafio Paraná</h3>
            <p className="text-sm text-success/90 mb-2">{atividade_desafio_parana.sugestao}</p>
            <span className="text-xs font-semibold bg-white/50 px-2 py-1 rounded text-success border border-success/20">
              Filtro: {atividade_desafio_parana.filtro_recomendado}
            </span>
          </div>
        </div>
      )}

      <div className="mt-8 relative">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <PlayCircle className="text-primary w-5 h-5" />
          Execução da Aula
        </h2>
        
        <div className="space-y-6">
          {etapas?.map((etapa: any, idx: number) => (
            <div key={idx} className="relative pl-6">
              <div className="absolute left-0 top-1 bottom-0 flex flex-col items-center">
                <div className="timeline-dot" />
                {idx !== etapas.length - 1 && <div className="timeline-line" />}
              </div>

              <div className="bg-surface border border-border p-5 rounded-xl ml-2 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base font-bold text-text flex items-center gap-2">
                    {etapa.nome}
                  </h3>
                  <span className="badge border-gray-200 bg-gray-50 text-gray-600 font-bold px-3 py-1 flex items-center gap-1">
                     <Clock className="w-3 h-3" /> {etapa.duracao_minutos} min
                  </span>
                </div>

                <p className="text-sm mb-4 leading-relaxed">{etapa.descricao}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="bg-primary-light border border-primary-border/40 p-3 rounded-lg">
                    <span className="text-xs font-bold uppercase text-primary block mb-1">Seu Papel (Monitor)</span>
                    <p className="text-sm text-primary/90 leading-snug">{etapa.papel_monitor}</p>
                  </div>
                  <div className="bg-success-light/50 border border-[#a8d07a]/40 p-3 rounded-lg">
                    <span className="text-xs font-bold uppercase text-success block mb-1">Papel do Aluno</span>
                    <p className="text-sm text-success/90 leading-snug">{etapa.papel_aluno}</p>
                  </div>
                </div>

                {etapa.dica_monitor && (
                  <div className="bg-warning-light p-3 rounded-lg flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                    <p className="text-sm text-warning/90">{etapa.dica_monitor}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card shadow-sm h-full flex flex-col">
          <h2 className="text-sm font-bold flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-primary" /> Materiais
          </h2>
          <div className="flex-1 space-y-4">
            <div>
              <span className="text-xs font-bold text-text-muted mb-1 block">Para o Monitor</span>
              <ul className="text-sm space-y-1">
                {materiais_apoio?.para_o_monitor?.map((i: string, idx: number) => <li key={`m${idx}`}>• {i}</li>) || <li className="text-muted">Nenhum</li>}
              </ul>
            </div>
            <div>
              <span className="text-xs font-bold text-text-muted mb-1 block">Para os Alunos</span>
              <ul className="text-sm space-y-1">
                {materiais_apoio?.para_o_aluno?.map((i: string, idx: number) => <li key={`a${idx}`}>• {i}</li>) || <li className="text-muted">Nenhum</li>}
              </ul>
            </div>
          </div>
        </div>

        <div className="card shadow-sm h-full flex flex-col">
          <h2 className="text-sm font-bold flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-warning" /> Adaptações Rápidas
          </h2>
          <div className="flex-1 space-y-4">
             <div>
              <span className="text-xs font-bold text-text-muted mb-1 block">Se a turma travar:</span>
              <p className="text-sm leading-snug bg-gray-50 border border-gray-100 p-2 rounded">{adaptacoes?.turma_com_dificuldade}</p>
             </div>
             <div>
              <span className="text-xs font-bold text-text-muted mb-1 block">Se sobrar tempo:</span>
              <p className="text-sm leading-snug bg-gray-50 border border-gray-100 p-2 rounded">{adaptacoes?.turma_avancada}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="card mt-4 shadow-sm">
        <h2 className="text-sm font-bold mb-2">Como Avaliar?</h2>
        <p className="text-sm border-l-2 border-primary pl-3 text-text-muted">{como_avaliar}</p>
      </div>

      {/* M0DAL DE REGISTRO RÁPIDO */}
      {modalRegistro && (
        <div className="fixed inset-0 bg-text/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 fade-in">
          <div className="bg-surface rounded-xl max-w-md w-full shadow-lg border border-border flex flex-col">
            <div className="p-5 border-b border-border flex justify-between items-center bg-gray-50 rounded-t-xl">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Registro da Aula
                </h2>
                <p className="text-xs text-text-muted mt-1 leading-snug">
                  Registre em 30 segundos como foi o desempenho da turma. O próximo monitor começará daqui.
                </p>
              </div>
              {!forcarRegistro && (
                <button onClick={() => setModalRegistro(false)} className="p-2 hover:bg-gray-200 rounded-lg text-text-muted self-start">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="p-5 space-y-4">
              {forcarRegistro && (
                 <div className="bg-warning-light text-warning p-3 rounded text-sm flex items-start gap-2 mb-2">
                   <AlertTriangle className="w-5 h-5 shrink-0" />
                   <p>Você precisa deixar o registro de como foi esta aula de hoje para ajudar a equipe pedagógica antes de prosseguir.</p>
                 </div>
              )}
              
              <div>
                 <textarea 
                   className="form-input min-h-[120px] resize-none"
                   placeholder="Ex: A turma estava agitada, conseguimos ir até o exercício 3. Os alunos sentiram dificuldade nas frações mistas."
                   value={notasAula}
                   onChange={e => setNotasAula(e.target.value)}
                 />
              </div>
            </div>

            <div className="p-5 border-t border-border flex gap-3">
              {!forcarRegistro && (
                <button onClick={() => setModalRegistro(false)} className="btn btn-ghost flex-1">Cancelar</button>
              )}
              <button 
                onClick={salvarRegistro} 
                disabled={salvandoRegistro || notasAula.trim().length < 5} 
                className="btn btn-primary bg-primary text-white flex-1"
              >
                {salvandoRegistro ? <div className="spinner !w-4 !h-4" /> : <><Save className="w-4 h-4" /> Salvar Histórico</>}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
