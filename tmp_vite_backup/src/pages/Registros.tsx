import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { History, Calendar, Search, Filter, BookOpen, User } from 'lucide-react';

export default function Registros() {
  const [registros, setRegistros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    async function carregarRegistros() {
      // Buscar do Banco de Dados usando a nova tabela class_logs
      const { data, error } = await supabase
        .from('class_logs')
        .select(`
          id,
          class_identifier,
          notes,
          created_at,
          lesson_plan_id,
          planos_gerados (conteudo_json, codigo_descritor, usage_type)
        `)
        .order('created_at', { ascending: false });

      if (data) setRegistros(data);
      setLoading(false);
    }
    carregarRegistros();
  }, []);

  const registrosFiltrados = registros.filter(r => 
    !filtro || r.class_identifier?.toLowerCase().includes(filtro.toLowerCase()) || r.planos_gerados?.codigo_descritor?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="fade-in space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
           Histórico da Turma
        </h1>
        <p className="text-sm text-text-muted mt-1">Acompanhe os recados deixados por quem aplicou aulas na rede ou veja o que a equipe pedagógica estudou.</p>
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
                <th className="p-4 font-bold border-b border-border">Recado / Contexto Educacional</th>
                <th className="p-4 font-bold border-b border-border text-center">Referência do Plano</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {registrosFiltrados.map(r => (
                <tr key={r.id} className="hover:bg-bg/50 transition-colors">
                  <td className="p-4 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-text-muted" />
                      {new Date(r.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="badge badge-blue">{r.class_identifier}</span>
                  </td>
                  <td className="p-4 text-sm max-w-xl">
                    <div className="flex items-start gap-2">
                       <User className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                       <span className="text-text leading-snug">{r.notes}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {r.planos_gerados ? (
                      <div className="flex flex-col items-center gap-1">
                        <span className="badge badge-purple">{r.planos_gerados.codigo_descritor}</span>
                        {r.planos_gerados.usage_type === 'apenas_estudo' && (
                           <span className="text-[10px] text-blue-500 font-bold bg-blue-50 px-2 rounded-full border border-blue-200">Apenas Estudo</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-text-muted text-xs">N/A</span>
                    )}
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
