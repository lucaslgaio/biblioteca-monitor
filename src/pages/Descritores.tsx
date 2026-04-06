import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { descritores } from '../data/descritores';
import type { Descritor } from '../data/descritores';
import { Search, Loader2, Play, AlertCircle, Cpu, Sparkles } from 'lucide-react';

export default function Descritores() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [ano, setAno] = useState('');
  
  // Modal de geração
  const [modalAberto, setModalAberto] = useState(false);
  const [descritorSelecionado, setDescritorSelecionado] = useState<Descritor | null>(null);
  
  // Form de geração
  const [turmas, setTurmas] = useState<any[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('2');
  
  // Loading animado
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    supabase.from('turmas').select('*').then(({ data }) => {
      if (data) setTurmas(data);
    });
  }, []);

  const descritoresFiltrados = descritores.filter(d => {
    const matchBusca = d.codigo.toLowerCase().includes(busca.toLowerCase()) || d.nome.toLowerCase().includes(busca.toLowerCase());
    const matchDisciplina = disciplina ? d.disciplina === disciplina : true;
    const matchAno = ano ? d.anos.includes(parseInt(ano)) : true;
    return matchBusca && matchDisciplina && matchAno;
  });

  const abrirModalGeração = (descritor: Descritor) => {
    setDescritorSelecionado(descritor);
    setModalAberto(true);
    setErro('');
  };

  const gerarPlano = async () => {
    if (!turmaSelecionada || !descritorSelecionado) {
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
      "Gerando plano de aula prático com Google Gemini...",
      "Finalizando minutagem e estruturação..."
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
      const turmaInfo = turmas.find(t => t.id === turmaSelecionada);
      
      // Buscar desempenho da turma se existir
      const { data: desempList } = await supabase
        .from('desempenho_descritores')
        .select('percentual_acerto')
        .eq('turma_id', turmaSelecionada)
        .eq('codigo_descritor', descritorSelecionado.codigo)
        .single();
        
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
          turma_id: turmaSelecionada,
          codigo_descritor: descritorSelecionado.codigo,
          nome_descritor: descritorSelecionado.nome,
          ano_escolar: turmaInfo.ano,
          disciplina: descritorSelecionado.disciplina,
          carga_horaria: parseInt(cargaHoraria),
          percentual_acerto_turma: percentualAcerto,
          principios_pedagogicos: prinData || [],
          exemplos_banco_excelencia: excData || []
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      
      clearInterval(interval);
      navigate(`/plano/${data.plano_id}`);

    } catch (error: any) {
      console.error(error);
      clearInterval(interval);
      setErro('Erro ao gerar plano com IA. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  return (
    <div className="fade-in space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Matriz Priorizada
        </h1>
        <p className="text-sm text-text-muted mt-1">Busque descritores da BNCC e Desafio Paraná para gerar aulas instantâneas.</p>
      </div>

      <div className="card shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Buscar por código (ex: D36) ou palavra-chave..." 
              className="form-input pl-9"
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <select className="form-input" value={disciplina} onChange={e => setDisciplina(e.target.value)}>
              <option value="">Todas disciplinas</option>
              <option value="matematica">Matemática</option>
              <option value="portugues">Português</option>
            </select>
            <select className="form-input w-32" value={ano} onChange={e => setAno(e.target.value)}>
              <option value="">Anos</option>
              <option value="6">6º Ano</option>
              <option value="7">7º Ano</option>
              <option value="8">8º Ano</option>
              <option value="9">9º Ano</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {descritoresFiltrados.map(desc => (
          <div key={desc.codigo} className="card hover:border-primary transition-all group flex flex-col justify-between p-5">
            <div>
              <div className="flex items-start justify-between mb-2">
                <span className="badge badge-purple font-mono">{desc.codigo}</span>
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  {desc.disciplina === 'matematica' ? 'Matemática' : 'Português'}
                </span>
              </div>
              <h3 className="font-medium text-14 leading-tight mb-2 text-text">{desc.nome}</h3>
              <p className="text-xs text-text-muted mt-2">{desc.eixo}</p>
            </div>
            
            <button 
              className="btn btn-primary w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => abrirModalGeração(desc)}
            >
              <Play className="w-4 h-4 mr-1" />
              Gerar Plano
            </button>
          </div>
        ))}
      </div>

      {descritoresFiltrados.length === 0 && (
        <div className="text-center py-16 text-text-muted">
          <p>Nenhum descritor encontrado para esta busca.</p>
        </div>
      )}

      {/* Modal de Geração */}
      {modalAberto && descritorSelecionado && (
        <div className="fixed inset-0 bg-text/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 fade-in">
          <div className="bg-surface rounded-xl max-w-lg w-full p-6 shadow-lg border border-border flex flex-col max-h-[90vh]">
            
            {!loading ? (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold">Configurar Plano Mágico</h2>
                    <p className="text-sm text-text-muted mt-1">Descritor {descritorSelecionado.codigo}: {descritorSelecionado.nome}</p>
                  </div>
                  <button onClick={() => setModalAberto(false)} className="text-text-muted hover:text-text">&times;</button>
                </div>

                {erro && (
                  <div className="mb-4 bg-danger-light text-danger p-3 rounded text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{erro}</span>
                  </div>
                )}

                <div className="space-y-4 flex-1 overflow-y-auto">
                  <div>
                    <label className="form-label">Para qual turma você vai dar aula?</label>
                    <select 
                      className="form-input"
                      value={turmaSelecionada}
                      onChange={e => setTurmaSelecionada(e.target.value)}
                    >
                      <option value="">Selecione...</option>
                      {turmas.filter(t => t.disciplina === descritorSelecionado.disciplina).map(t => (
                        <option key={t.id} value={t.id}>{t.nome} - {t.escola}</option>
                      ))}
                    </select>
                    <p className="text-xs text-text-muted mt-1">Isso ajuda a IA a ajustar o nível com base no percentual de acerto histórico do Desafio Paraná.</p>
                  </div>

                  <div>
                    <label className="form-label">Duração da aula</label>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-2 border p-3 rounded-lg flex-1 cursor-pointer hover:border-primary">
                        <input type="radio" name="carga" value="1" checked={cargaHoraria === '1'} onChange={e => setCargaHoraria(e.target.value)} />
                        <div>
                          <span className="block font-medium text-sm">1 bloco</span>
                          <span className="text-xs text-text-muted">45 minutos</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-2 border p-3 rounded-lg flex-1 cursor-pointer hover:border-primary">
                        <input type="radio" name="carga" value="2" checked={cargaHoraria === '2'} onChange={e => setCargaHoraria(e.target.value)} />
                        <div>
                          <span className="block font-medium text-sm">2 blocos</span>
                          <span className="text-xs text-text-muted">90 minutos</span>
                        </div>
                      </label>
                    </div>
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
