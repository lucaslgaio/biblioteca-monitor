import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, FileText, Target, Award, History, Layers } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages - We will implement these next
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Descritores from './pages/Descritores';
import PlanoDetalhe from './pages/PlanoDetalhe';
import Turmas from './pages/Turmas';
import BancoExcelencia from './pages/BancoExcelencia';
import Registros from './pages/Registros';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

const Header = () => {
  const { user, signOut } = useAuth();
  
  if (!user) return null;

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary font-semibold text-lg">
          <BookOpen className="w-5 h-5" />
          <span>Biblioteca do Monitor</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-text-muted">
            {user.email}
          </div>
          <button 
            onClick={signOut}
            className="btn btn-ghost p-2"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

const SidebarNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Planos de aula', path: '/', icon: <FileText className="w-4 h-4" /> },
    { name: 'Matriz Priorizada', path: '/descritores', icon: <Target className="w-4 h-4" /> },
    { name: 'Turmas', path: '/turmas', icon: <Layers className="w-4 h-4" /> },
    { name: 'Banco de Excelência', path: '/banco-excelencia', icon: <Award className="w-4 h-4" /> },
    { name: 'Registro de aulas', path: '/registros', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <nav className="flex flex-col gap-1 w-64 flex-shrink-0">
      <div className="font-semibold text-xs text-text-muted uppercase tracking-wider mb-2 px-3">
        Navegação Principal
      </div>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-primary-light text-primary' 
                : 'text-text hover:bg-surface hover:text-primary'
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};

const LayoutContainer = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {!isLoginPage && <Header />}
      
      <main className={`flex-1 ${!isLoginPage ? 'container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6' : ''}`}>
        {!isLoginPage && user && (
          <SidebarNavigation />
        )}
        <div className="flex-1 w-full min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <LayoutContainer>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <PrivateRoute><Dashboard /></PrivateRoute>
            } />
            <Route path="/descritores" element={
              <PrivateRoute><Descritores /></PrivateRoute>
            } />
            <Route path="/plano/:id" element={
              <PrivateRoute><PlanoDetalhe /></PrivateRoute>
            } />
            <Route path="/turmas" element={
              <PrivateRoute><Turmas /></PrivateRoute>
            } />
            <Route path="/banco-excelencia" element={
              <PrivateRoute><BancoExcelencia /></PrivateRoute>
            } />
            <Route path="/registros" element={
              <PrivateRoute><Registros /></PrivateRoute>
            } />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </LayoutContainer>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
