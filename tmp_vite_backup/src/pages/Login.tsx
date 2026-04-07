import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      // se der sucesso, o AuthContext onAuthStateChange vai redirecionar porque "user" passara a existir
    } catch (error: any) {
      setErrorMsg(error.message || 'Erro ao fazer login. Verifique as credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center -mt-16 md:mt-0 min-h-[80vh]">
      <div className="card w-full max-w-sm p-8 shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-text mb-1">Biblioteca do Monitor</h1>
          <p className="text-sm text-text-muted">Faça login com sua conta Tom Educação</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-danger-light text-danger border border-[#e5a5a5] rounded-lg text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="form-label" htmlFor="email">E-mail</label>
            <input 
              id="email"
              type="email" 
              className="form-input" 
              placeholder="seu.nome@tomeducacao.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="form-label" htmlFor="password">Senha</label>
            <input 
              id="password"
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full mt-2 justify-center py-2.5"
            disabled={loading}
          >
            {loading ? (
              <div className="spinner !w-4 !h-4 !border-primary-border !border-t-primary" />
            ) : (
              <>
                Entrar
                <LogIn className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
