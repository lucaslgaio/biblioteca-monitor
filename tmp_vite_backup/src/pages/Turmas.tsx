import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Layers, Plus, TrendingUp, Presentation, School, Save, X, Search } from 'lucide-react';
import { descritores } from '../data/descritores';

export default function Turmas() {
  const [turmas, setTurmas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Atualizar Desempenho
  const [modalTurma, setModalTurma] = useState<any>(null);
  const [buscaDesc, setBuscaDesc] = useState('');
  const [notasTemp, setNotasTemp] = useState<{ [codigo: string]: string }>({});
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarTurmas();
  }, []);

  const carregarTurmas = async () => {
    const { data: turmasData } = await supabase.from('turmas').select('*').order('ano', { ascending: true });
    
    // Buscar quantidade de planos por turma (apenas para métrica)
    const { data: planosData } = await supabase.from('planos_gerados').select('turma_id');
    
    if (turmasData) {
      const turmasComMetricas = turmasData.map(t => ({
        ...t,
        qtd_planos: planosData?.filter(p => p.turma_id === t.id).length || 0
      }));
      setTurmas(turmasComMetricas);
    }
    setLoading(false);
  };

  const abrirModalDesempenho = async (turma: any) => {
    setModalTurma(turma);
    setNotasTemp({});
    setBuscaDesc('');
    
    // Carregar notas atuais
    const { data } = await supabase.from('desempenho_descritores').select('*').eq('turma_id', turma.id);
    if (data) {
      const mapeamento: { [key: string]: string } = {};
      data.forEach(d => mapeamento[d.codigo_descritor] = d.percentual_acerto.toString());
      setNotasTemp(mapeamento);
    }
  };

  const salvarDesempenho = async () => {
    if (!modalTurma) return;
    setSalvando(true);

    try {
      // 1. Apagar desempenho antigo dessa turma (para recriar limpo)
      await supabase.from('desempenho_descritores').delete().eq('turma_id', modalTurma.id);

      // 2. Filtrar apenas notas válidas e inseri-las
      const novosRegistros = Object.entries(notasTemp)
        .filter(([_, valor]) => valor !== '' && !isNaN(parseInt(valor)))
        .map(([codigo, valor]) => {
          const descritorBase = descritores.find(d => d.codigo === codigo);
          return {
            turma_id: modalTurma.id,
            codigo_descritor: codigo,
            nome_descritor: descritorBase ? descritorBase.nome : `Descritor ${codigo}`,
            percentual_acerto: parseInt(valor),
            fonte: 'manual'
          };
        });

      if (novosRegistros.length > 0) {
        await supabase.from('desempenho_descritores').insert(novosRegistros);
      }

      setModalTurma(null);
      // Feedback opcional (toast) iria aqui
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar desempenho.");
    } finally {
      setSalvando(false);
    }
  };

  const lidarComNota = (codigo: string, valorStr: string) => {
    if (valorStr === '') {
      setNotasTemp(prev => { const nw = {...prev}; delete nw[codigo]; return nw; });
      return;
    }
    
    const valor = parseInt(valorStr);
    if (valor >= 0 && valor <= 100) {
      setNotasTemp(prev => ({ ...prev, [codigo]: valor.toString() }));
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner !w-8 !h-8 border-[3px]" /></div>;

  return (
    <div className="fade-in space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
             Turmas
          </h1>
          <p className="text-sm text-text-muted mt-1">Gerencie suas turmas e mapeie defasagens com o painel de notas.</p>
        </div>
        <button className="btn btn-primary" onClick={() => alert("A criação de novas turmas na biblioteca de monitoramento central será liberada em breve.")}>
          <Plus className="w-4 h-4" />
          Nova Turma
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {turmas.map(t => (
          <div key={t.id} className="card flex flex-col justify-between hover:border-primary transition-colors hover:shadow-sm">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="badge badge-blue">{t.ano}º Ano {t.turma}</span>
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{t.disciplina}</span>
              </div>
              <h3 className="font-bold text-lg mb-1">{t.nome}</h3>
              <p className="text-sm flex items-center gap-1 text-text-muted mb-4">
                <School className="w-3.5 h-3.5" />
                {t.escola}
              </p>
            </div>
            
            <div className="pt-4 border-t border-border flex items-center justify-between">
               <div className="text-xs text-text-muted">
                 <span className="font-bold text-text">{t.qtd_planos}</span> planos aplicados
               </div>
               <button 
                 onClick={() => abrirModalDesempenho(t)}
                 className="btn btn-ghost !px-2 !py-1 text-xs text-primary bg-primary-light/50 border border-primary/20"
               >
                 <TrendingUp className="w-3 h-3" /> Atualizar Mapa
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Desempenho */}
      {modalTurma && (
        <div className="fixed inset-0 bg-text/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 fade-in">
          <div className="bg-surface rounded-xl max-w-3xl w-full flex flex-col max-h-[90vh]">
            
            <div className="p-5 border-b border-border flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">Mapa de Desempenho</h2>
                <p className="text-sm text-text-muted mt-1">Atualizando turma: <strong>{modalTurma.nome}</strong></p>
              </div>
              <button disabled={salvando} onClick={() => setModalTurma(null)} className="p-2 hover:bg-bg rounded-lg">
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="p-5 border-b border-border bg-bg flex-shrink-0">
               <div className="relative">
                 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                 <input 
                   type="text" 
                   className="form-input pl-9" 
                   placeholder="Buscar descritor para atualizar nota..." 
                   value={buscaDesc}
                   onChange={e => setBuscaDesc(e.target.value)}
                 />
               </div>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-3">
              {descritores
                .filter(d => d.disciplina === modalTurma.disciplina && d.anos.includes(modalTurma.ano))
                .filter(d => d.codigo.toLowerCase().includes(buscaDesc.toLowerCase()) || d.nome.toLowerCase().includes(buscaDesc.toLowerCase()))
                .map(d => (
                  <div key={d.codigo} className="card-sm flex items-center justify-between border-dashed">
                    <div className="flex-1 pr-4">
                      <span className="text-xs font-bold text-primary block mb-1">{d.codigo} {notasTemp[d.codigo] ? `• ${(notasTemp[d.codigo])}% acerto` : ''}</span>
                      <p className="text-sm font-medium">{d.nome}</p>
                    </div>
                    <div className="w-24 shrink-0">
                      <div className="relative">
                        <input 
                          type="number" 
                          min="0" max="100"
                          placeholder="  -"
                          className="form-input text-center pr-6"
                          value={notasTemp[d.codigo] || ''}
                          onChange={(e) => lidarComNota(d.codigo, e.target.value)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-xs font-medium pointer-events-none">%</span>
                      </div>
                    </div>
                  </div>
              ))}
            </div>

            <div className="p-5 border-t border-border bg-surface flex justify-end gap-3 rounded-b-xl">
               <button disabled={salvando} onClick={() => setModalTurma(null)} className="btn btn-ghost pt-2 pb-2">Cancelar</button>
               <button disabled={salvando} onClick={salvarDesempenho} className="btn btn-primary pt-2 pb-2">
                 {salvando ? <div className="spinner !w-4 !h-4" /> : <><Save className="w-4 h-4" /> Salvar Mapa</>}
               </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
