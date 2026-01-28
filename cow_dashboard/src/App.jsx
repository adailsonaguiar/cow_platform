import { useState, useEffect } from 'react';
import { Dashboard } from '@/pages/Dashboard';
import { Login } from '@/pages/Login';
import { Toaster } from '@/components/ui/Toast';
import { authService } from '@/services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se já está autenticado ao carregar
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      const savedUser = authService.getUser();

      if (isAuth && savedUser) {
        setIsAuthenticated(true);
        setUser(savedUser);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
      <Toaster />
    </>
  );
}

export default App;
