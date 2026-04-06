import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Info, Sparkles, Star, Target, CheckCircle2 } from 'lucide-react';

export default function BancoExcelencia() {
  const [principios, setPrincipios] = useState<any[]>([]);
  const [exemplos, setExemplos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDados() {
      const { data: princ } = await supabase.from('principios_pedagogicos').select('*').order('numero', { ascending: true });
      const { data: exemp } = await supabase.from('banco_excelencia').select('*').order('num_aplicacoes', { ascending: false });
      
      if(princ) setPrincipios(princ);
      if(exemp) setExemplos(exemp);
      
      setLoading(false);
    }
    fetchDados();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="spinner !w-8 !h-8 border-[3px]" />
      </div>
    );
  }

  return (
    <div className="fade-in max-w-6xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold">Banco de Excelência Pedagógica</h1>
        <p className="text-sm text-text-muted mt-1">
          Estas são as regras e exemplos reais que a nossa IA obedece. Ela nunca inventa metodologias, apenas escala o que já funciona nas nossas escolas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Princípios Inegociáveis */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-purple-light border border-purple/20 p-4 rounded-xl flex items-start gap-3 shadow-sm">
            <Sparkles className="text-purple w-6 h-6 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-purple mb-1">Como a IA "pensa"?</h3>
              <p className="text-sm text-purple/80 leading-relaxed">
                Antes de gerar cada plano, o Gemini lê os 5 princípios abaixo rigorosamente. Se a IA sugerir algo vago, ela mesma se corrige para garantir minutagem clara, mobilização antes de conteúdo e limite de um objetivo.
              </p>
            </div>
          </div>

          <h2 className="font-bold text-lg pt-2 mt-4 border-t border-border">5 Princípios Inegociáveis</h2>
          <div className="space-y-4">
            {principios.map((p) => (
              <div key={p.id} className="card !p-4 hover:border-primary transition-colors flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0">
                  {p.numero}
                </div>
                <div>
                  <h3 className="font-bold mb-1">{p.titulo}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{p.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Casos reais */}
        <div className="lg:col-span-7 space-y-4">
           <div className="flex items-center gap-2 mb-2">
            <Star className="text-warning fill-warning w-5 h-5" />
            <h2 className="font-bold text-lg">Casos de Sucesso da Rede (Exemplos Injetados na IA)</h2>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {exemplos.map(e => (
               <div key={e.id} className="card shadow-sm h-full flex flex-col hover:border-primary transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <span className="badge badge-purple font-mono">{e.codigo_descritor}</span>
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <Target className="w-3 h-3" /> Aplicado {e.num_aplicacoes}x
                    </span>
                  </div>
                  
                  <h3 className="font-bold mb-1">{e.titulo}</h3>
                  <p className="text-xs text-text-muted mb-4">{e.ano_escolar}º Ano • {e.disciplina === 'matematica' ? 'Matemática' : 'Português'}</p>
                  
                  <div className="mt-auto pt-3 border-t border-border/50 bg-gray-50 -mx-4 px-4 -mb-4 rounded-b-xl pb-4">
                    <span className="text-xs font-bold text-text-muted mb-2 block uppercase tracking-wide flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Feedback do Professor
                    </span>
                    <p className="text-sm italic text-text-muted leading-snug">"{e.trecho_feedback}"</p>
                    <p className="text-xs font-medium text-right mt-2 text-text-muted">— {e.avaliado_por}</p>
                  </div>
               </div>
             ))}
           </div>

           <div className="card mt-6 border-dashed bg-transparent p-6 text-center">
             <Info className="w-6 h-6 text-text-muted mx-auto mb-2 opacity-50" />
             <p className="text-sm text-text-muted max-w-sm mx-auto">
               Em breve: Monitores poderão votar nos planos gerados e a IA aprenderá automaticamente e catalogará aqui os melhores planos.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
}
