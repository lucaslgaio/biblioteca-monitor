import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Play, Sparkles, Filter, AlertCircle, ChevronRight } from 'lucide-react';
import { descritores } from '../data/descritores';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [turmas, setTurmas] = useState<any[]>([]);
  const [planos, setPlanos] = useState<any[]>([]);
  const [desempenho, setDesempenho] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>('');
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<string>('');
  const [abaAtiva, setAbaAtiva] = useState<'desempenho' | 'todos'>('desempenho');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // Carregar turmas
      const { data: turmasData } = await supabase.from('turmas').select('*');
      if (turmasData) setTurmas(turmasData);

      // Carregar planos gerados
      const { data: planosData } = await supabase
        .from('planos_gerados')
        .select('*, turmas(nome, disciplina)')
        .order('created_at', { ascending: false });
      if (planosData) setPlanos(planosData);

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

  // Derivados
  const turmasFiltradas = turmas.filter(t => !disciplinaSelecionada || t.disciplina === disciplinaSelecionada);
  
  const desempenhoTurmaAtual = turmaSelecionada
    ? desempenho.filter(d => d.turma_id === turmaSelecionada).sort((a, b) => a.percentual_acerto - b.percentual_acerto)
    : [];

  const getBadgeColor = (percentual: number) => {
    if (percentual < 50) return 'badge-red';
    if (percentual <= 70) return 'badge-yellow';
    return 'badge-green';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="spinner !w-8 !h-8 border-[3px]" />
          <p className="text-text-muted font-medium">Carregando painel principal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Planos de Aula</h1>
          <p className="text-text-muted text-sm mt-1">Gere aulas rápidas baseadas nas defasagens da turma.</p>
        </div>
        <button onClick={() => navigate('/descritores')} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Gerar Novo Plano
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUNA 1: Seleção e Geração */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="card space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              Filtros
            </h2>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Disciplina</label>
                <select 
                  className="form-input" 
                  value={disciplinaSelecionada}
                  onChange={e => {
                    setDisciplinaSelecionada(e.target.value);
                    setTurmaSelecionada('');
                  }}
                >
                  <option value="">Todas</option>
                  <option value="matematica">Matemática</option>
                  <option value="portugues">Português</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Turma</label>
                <select 
                  className="form-input"
                  value={turmaSelecionada}
                  onChange={e => setTurmaSelecionada(e.target.value)}
                >
                  <option value="">Selecione a turma...</option>
                  {turmasFiltradas.map(t => (
                    <option key={t.id} value={t.id}>{t.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            {turmaSelecionada && desempenhoTurmaAtual.length > 0 && (
              <div className="bg-success-light border border-[#a8d07a] p-3 rounded-lg flex items-start gap-2 mt-2">
                <Sparkles className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <p className="text-xs text-success font-medium">
                  Resultados do Desafio Paraná carregados. Priorize os descritores em vermelho.
                </p>
              </div>
            )}
          </div>

          <div className="card h-full flex flex-col">
            <div className="flex border-b border-border -mx-4 px-4 mb-4">
              <button 
                className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${abaAtiva === 'desempenho' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'}`}
                onClick={() => setAbaAtiva('desempenho')}
              >
                Por Defasagem
              </button>
              <button 
                className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${abaAtiva === 'todos' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'}`}
                onClick={() => setAbaAtiva('todos')}
              >
                Todos Descritores
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: '400px' }}>
              {abaAtiva === 'desempenho' ? (
                turmaSelecionada ? (
                  desempenhoTurmaAtual.length > 0 ? (
                    <div className="space-y-3">
                      {desempenhoTurmaAtual.map(d => (
                        <div key={d.id} className="card-sm flex items-center justify-between border-dashed hover:border-primary transition-colors hover:shadow-sm">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`badge ${getBadgeColor(d.percentual_acerto)}`}>
                                {d.percentual_acerto}% acerto
                              </span>
                              <span className="text-xs font-bold text-text-muted">{d.codigo_descritor}</span>
                            </div>
                            <p className="text-sm font-medium pr-4 line-clamp-2">{d.nome_descritor}</p>
                          </div>
                          <button onClick={() => navigate('/descritores')} className="btn btn-primary p-2 flex-shrink-0">
                            <Play className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-text-muted">
                      <AlertCircle className="w-8 h-8 opacity-50 mx-auto mb-2" />
                      <p className="text-sm">Sem dados de Desafio Paraná para esta turma.</p>
                      <button onClick={() => setAbaAtiva('todos')} className="text-primary hover:underline text-xs mt-2">Escolher manualmente</button>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8 text-text-muted">
                    <p className="text-sm">Selecione uma turma para ver o desempenho.</p>
                  </div>
                )
              ) : (
                <div className="space-y-3">
                   {descritores.filter(d => !disciplinaSelecionada || d.disciplina === disciplinaSelecionada).slice(0, 5).map(d => (
                    <div key={d.codigo} className="card-sm flex items-center justify-between border-dashed hover:border-primary transition-colors">
                      <div>
                        <span className="text-xs font-bold text-primary mb-1 block">{d.codigo}</span>
                        <p className="text-sm font-medium pr-4 line-clamp-2">{d.nome}</p>
                      </div>
                      <button onClick={() => navigate('/descritores')} className="btn btn-ghost p-2 flex-shrink-0">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                   ))}
                   <button onClick={() => navigate('/descritores')} className="btn btn-ghost w-full text-sm">Ver todos...</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COLUNA 2: Histórico de Planos */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="card h-full">
            <h2 className="font-semibold mb-4">Planos Gerados Recentemente</h2>
            <div className="space-y-3 overflow-y-auto" style={{ maxHeight: '600px' }}>
              {planos.length === 0 ? (
                <div className="text-center py-8 text-text-muted text-sm">Nenhum plano gerado.</div>
              ) : (
                planos.map(plan => (
                  <div key={plan.id} className="card-sm cursor-pointer hover:border-primary transition-colors relative pl-4 overflow-hidden group" onClick={() => navigate(`/plano/${plan.id}`)}>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary group-hover:bg-primary-border" />
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-text-muted">{plan.turmas?.nome}</span>
                      <span className="badge badge-purple">{plan.codigo_descritor}</span>
                    </div>
                    <h3 className="text-sm font-semibold mb-1 line-clamp-2">{plan.conteudo_json.titulo}</h3>
                    <p className="text-xs text-text-muted">{plan.carga_horaria} bloco(s)</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* COLUNA 3: Visualização do Desempenho */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="card h-full bg-surface">
            <h2 className="font-semibold mb-1">Mapa de Turma</h2>
            <p className="text-xs text-text-muted mb-4">
              {turmaSelecionada ? turmas.find(t => t.id === turmaSelecionada)?.nome : 'Selecione uma turma'}
            </p>

            {!turmaSelecionada ? (
               <div className="text-center py-10 opacity-40">
                  <Layers className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-sm">Nenhuma turma selecionada</p>
               </div>
            ) : desempenhoTurmaAtual.length === 0 ? (
              <p className="text-sm text-text-muted text-center pt-8">Sem mapa de proficiência estruturado.</p>
            ) : (
              <div className="space-y-4">
                {desempenhoTurmaAtual.map(d => (
                  <div key={d.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold">{d.codigo_descritor}</span>
                      <span className="font-medium text-text-muted">{d.percentual_acerto}%</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${d.percentual_acerto < 50 ? 'bg-danger' : d.percentual_acerto <= 70 ? 'bg-warning' : 'bg-success'}`} 
                        style={{ width: `${d.percentual_acerto}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
