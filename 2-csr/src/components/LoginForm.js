import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // MODE DEV : Compte de test local (à retirer plus tard)
    if (username === 'testdev' && password === 'testdev') {
      // Simuler une connexion réussie
      const fakeToken = 'fake-token-for-dev-' + Date.now();
      const fakeUser = { username: 'testdev', id: 'dev-user' };
      
      localStorage.setItem('auth_token', fakeToken);
      localStorage.setItem('user', JSON.stringify(fakeUser));
      
      // Recharger la page pour que AuthContext récupère les données
      window.location.href = '/';
      return;
    }

    // Sinon, tentative de connexion réelle avec l'API

    const result = await login(username, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>🔐 Connexion</h2>
        
        {error && (
          <div style={styles.error}>
            ❌ {error}
          </div>
        )}
        
        <div style={styles.field}>
          <label style={styles.label}>Nom d'utilisateur</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
            placeholder="Entrez votre nom d'utilisateur"
          />
        </div>
        
        <div style={styles.field}>
          <label style={styles.label}>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
            placeholder="Entrez votre mot de passe"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
        
        <button 
          type="button"
          onClick={() => navigate('/')}
          style={styles.cancelButton}
        >
          Retour à l'accueil
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '70vh',
    padding: '2rem',
  },
  form: {
    width: '100%',
    maxWidth: '450px',
    padding: '3rem',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '2rem',
    color: '#333',
  },
  field: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1.1rem',
    fontWeight: '500',
    cursor: 'pointer',
    marginBottom: '1rem',
  },
  cancelButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  error: {
    padding: '1rem',
    backgroundColor: '#ffebee',
    color: '#c62828',
    borderRadius: '6px',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
};