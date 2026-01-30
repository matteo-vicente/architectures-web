import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFavoritesByUser } from '../services/api';
import { getFavorites } from '../services/api';
import { useNavigate } from 'react-router-dom';
import RecipeCard from './RecipeCard';

export default function Favorites() {
  const { token, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    if (!user?.username) {
      setError("Username indisponible (reconnecte-toi).");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getFavoritesByUser(user.username, token);

      // IMPORTANT: l’API renvoie [{ recipe: {...} }]
      const recipes = Array.isArray(data) ? data.map((row) => row.recipe) : [];
      setFavorites(recipes);

      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated, user?.username]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  if (!isAuthenticated) {
    return (
      <div style={styles.notConnected}>
        <h2>🔒 Accès restreint</h2>
        <p>Vous devez être connecté pour voir vos recettes favorites.</p>
        <button onClick={() => navigate('/login')} style={styles.loginButton}>
          Se connecter
        </button>
      </div>
    );
  }

  if (loading) {
    return <div style={styles.loading}>Chargement de vos favoris...</div>;
  }

  if (error) {
    return <div style={styles.error}>❌ Erreur : {error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>❤️ Mes recettes favorites</h1>
      
      {favorites.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyText}>
            Vous n'avez pas encore de recettes favorites.
          </p>
          <button onClick={() => navigate('/')} style={styles.browseButton}>
            Parcourir les recettes
          </button>
        </div>
      ) : (
        <>
          <p style={styles.subtitle}>{favorites.length} recette{favorites.length > 1 ? 's' : ''} favorite{favorites.length > 1 ? 's' : ''}</p>
          <div style={styles.grid}>
            {favorites.map((recette) => (
              <RecipeCard 
                key={recette.id} 
                recette={recette} 
                isFavorite={true}
                onFavoriteChange={loadFavorites}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
    color: '#333',
  },
  subtitle: {
    color: '#666',
    fontSize: '1.1rem',
    marginBottom: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
  },
  notConnected: {
    textAlign: 'center',
    padding: '4rem',
  },
  loginButton: {
    padding: '1rem 2rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  empty: {
    textAlign: 'center',
    padding: '4rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  emptyText: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '2rem',
  },
  browseButton: {
    padding: '1rem 2rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1.1rem',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.2rem',
  },
  error: {
    textAlign: 'center',
    padding: '4rem',
    color: '#d32f2f',
    fontSize: '1.2rem',
  },
};