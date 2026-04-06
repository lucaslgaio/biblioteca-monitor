import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { History, Calendar, CheckCircle, Search, Filter } from 'lucide-react';

export default function Registros() {
  const [registros, setRegistros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    async function carregarRegistros() {
      // Como não tem botão funcionando de "Registrar" 100% amarrado na outra tela, mockaremos ou traremos vazio caso não exista
      const { data, error } = await supabase
        .from('registros_aulas')
        .select('*, turmas(nome), planos_gerados(conteudo_json)')
        .order('data_aula', { ascending: false });

      if (data) setRegistros(data);
      setLoading(false);
    }
    carregarRegistros();
  }, []);

  const registrosFiltrados = registros.filter(r => 
    !filtro || r.turmas?.nome?.toLowerCase().includes(filtro.toLowerCase()) || r.codigo_descritor?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="fade-in space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
           Histórico de Substituições
        </h1>
        <p className="text-sm text-text-muted mt-1">Acompanhe as aulas que você e outros monitores aplicaram na rede.</p>
      </div>

      <div className="card shadow-sm mb-6 flex gap-4 items-center">
        <Filter className="w-4 h-4 text-primary" />
        <div className="relative flex-1 max-w-sm">
           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
           <input 
             type="text" 
             className="form-input pl-9" 
             placeholder="Filtrar por turma ou descritor..." 
             value={filtro}
             onChange={e => setFiltro(e.target.value)}
           />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="spinner !w-8 !h-8 border-[3px]" /></div>
      ) : registrosFiltrados.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-dashed border-border rounded-xl">
           <History className="w-12 h-12 text-border mx-auto mb-3" />
           <h3 className="font-bold text-text mb-1">Nenhum registro encontrado</h3>
           <p className="text-sm text-text-muted">As aulas dadas e confirmadas aparecerão aqui.</p>
        </div>
      ) : (
        <div className="card !p-0 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg text-xs uppercase tracking-wider text-text-muted">
                <th className="p-4 font-bold w-32 border-b border-border">Data</th>
                <th className="p-4 font-bold border-b border-border">Turma</th>
                <th className="p-4 font-bold border-b border-border">Conteúdo Gerado</th>
                <th className="p-4 font-bold border-b border-border text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {registrosFiltrados.map(r => (
                <tr key={r.id} className="hover:bg-bg/50 transition-colors">
                  <td className="p-4 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-text-muted" />
                      {new Date(r.data_aula).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="badge badge-blue">{r.turmas?.nome || 'Turma Excluída'}</span>
                  </td>
                  <td className="p-4 text-sm max-w-[250px] truncate">
                    <span className="font-bold mr-2">{r.codigo_descritor}</span>
                    <span className="text-text-muted">{r.planos_gerados?.conteudo_json?.titulo || 'Plano Manual'}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="badge bg-success-light text-success border-success/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Concluída
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
