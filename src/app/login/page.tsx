import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="fixed inset-0 bg-[#001141] flex items-center justify-center p-4 z-[100]">
      <div className="absolute top-4 left-0 right-0 max-w-sm mx-auto">
         <div className="text-red-500 text-xs font-bold text-center py-2 bg-red-100/10 w-full animate-pulse rounded border border-red-500/20">
            [ MOCKUP ]: Login visual. A submissão precisa acionar a função `supabase.auth.signInWithPassword`.
         </div>
      </div>

      {/* Padrão Geométrico de Fundo */}
      <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0F62FE]/30 via-[#001141] to-[#001141]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
           <defs>
              <pattern id="tangram" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                 <polygon points="50,0 100,50 50,100 0,50" fill="none" stroke="#0F62FE" strokeWidth="2" />
              </pattern>
           </defs>
           <rect x="0" y="0" width="100%" height="100%" fill="url(#tangram)" />
        </svg>
      </div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl relative z-10">
        <div className="text-center mb-8">
           <div className="text-white font-bold text-3xl tracking-tight mb-2">
              <span className="text-[#0F62FE]">Tom</span> Educação
           </div>
           <p className="text-gray-400 text-sm">Biblioteca Monitor</p>
        </div>

        <form className="space-y-4">
           <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">E-mail corporativo</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                 </div>
                 <input 
                    type="email" 
                    className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg bg-[#001141]/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0F62FE] focus:border-transparent sm:text-sm" 
                    placeholder="voce@tomeducacao.com.br"
                 />
              </div>
           </div>

           <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Senha</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                 </div>
                 <input 
                    type="password" 
                    className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg bg-[#001141]/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0F62FE] focus:border-transparent sm:text-sm" 
                    placeholder="••••••••"
                 />
              </div>
           </div>

           <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                 <input id="remember-me" type="checkbox" className="h-4 w-4 text-[#0F62FE] focus:ring-[#0F62FE] border-gray-300 rounded bg-[#001141]" />
                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Lembrar-me
                 </label>
              </div>
              <div className="text-sm">
                 <a href="#" className="font-medium text-[#0F62FE] hover:underline">
                    Esqueceu a senha?
                 </a>
              </div>
           </div>

           <div className="pt-4">
              <button 
                 type="submit" 
                 className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#0F62FE] hover:bg-[#002D9C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F62FE] transition-colors"
                 onClick={(e) => { e.preventDefault(); alert('Login mockado! Integração pendente.'); }}
              >
                 Entrar na Plataforma
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}
