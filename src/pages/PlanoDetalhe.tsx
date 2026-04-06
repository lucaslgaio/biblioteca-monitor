import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Printer, CheckCircle, ArrowLeft, Lightbulb, Clock, BookOpen, AlertTriangle, PlayCircle } from 'lucide-react';

export default function PlanoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [planoRaw, setPlanoRaw] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [id]);

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
          materiais_apoio, adaptacoes, como_avaliar } = planoRaw.conteudo_json;

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
          <button className="btn btn-primary">
            <CheckCircle className="w-4 h-4" />
            Registrar Aula
          </button>
        </div>
      </div>

      {/* Cabeçalho */}
      <div className="bg-surface border border-border rounded-t-xl p-8 shadow-sm">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="badge badge-purple">{planoRaw.codigo_descritor}</span>
          <span className="badge badge-blue">{planoRaw.turmas?.nome}</span>
          <span className="badge bg-surface border-border text-text-muted">
            <Clock className="w-3 h-3 mr-1 inline" /> {duracao_total_minutos} min
          </span>
        </div>
        
        <h1 className="text-3xl font-bold mb-3 text-text leading-tight">{titulo}</h1>
        <p className="text-lg text-text-muted mb-6">{finalidade}</p>

        <div className="flex flex-wrap gap-x-8 gap-y-4 pt-4 border-t border-border">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-1">BNCC</span>
            <span className="text-sm font-medium">{habilidade_bncc || 'N/A'}</span>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-1">Objetivos ({objetivos_aprendizagem?.length || 0})</span>
            <ul className="text-sm">
              {objetivos_aprendizagem?.map((obj: string, i: number) => <li key={i}>• {obj}</li>)}
            </ul>
          </div>
        </div>
      </div>

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

      {/* Timeline da Aula */}
      <div className="mt-8 relative">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <PlayCircle className="text-primary w-5 h-5" />
          Execução da Aula
        </h2>
        
        <div className="space-y-6">
          {etapas?.map((etapa: any, idx: number) => (
            <div key={idx} className="relative pl-6">
              {/* Timeline dot */}
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

      {/* Blocos Finais */}
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

    </div>
  );
}
