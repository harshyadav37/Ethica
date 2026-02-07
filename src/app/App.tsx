import { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AppLayout from './pages/app/Layout';

type Page = 'landing' | 'signup' | 'login' | 'app';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('app');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('landing');
  };

  if (currentPage === 'landing') {
    return <Landing onNavigate={handleNavigate} />;
  }

  if (currentPage === 'signup') {
    return <Signup onNavigate={handleNavigate} onSignup={handleLogin} />;
  }

  if (currentPage === 'login') {
    return <Login onNavigate={handleNavigate} onLogin={handleLogin} />;
  }

  if (currentPage === 'app' && isAuthenticated) {
    return <AppLayout onLogout={handleLogout} />;
  }

  return <Landing onNavigate={handleNavigate} />;
}
