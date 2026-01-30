import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // const [user, setUser] = useState(null);
  // const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState(
    () => localStorage.getItem('auth_token')
  );

  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem('user'))
  );

const isAuthenticated = !!token;

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('user');
      
      if (savedToken && savedUser) {
        // Vérifier que le JSON est valide
        try {
          const parsedUser = JSON.parse(savedUser);
          setToken(savedToken);
          setUser(parsedUser);
        } catch (parseError) {
          console.error('Erreur de parsing du user:', parseError);
          // Si le JSON est corrompu, on nettoie
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'auth:', error);
      // En cas d'erreur, on nettoie tout
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const data = await apiLogin(username, password);

      // console.log("LOGIN RESPONSE :", data);
      
      setToken(data.token);
      setUser({ username });
      // setUser(data.user);
      
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify({ username }));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('dev_favorites');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    loading,
  };

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem'
      }}>
        Chargement...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}