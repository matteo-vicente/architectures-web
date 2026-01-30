import { useState, useEffect } from 'react';
import { getRecettes, getFavoritesByUser } from '../services/api';
import RecipeCard from './RecipeCard';
import { useAuth } from '../context/AuthContext';

export default function RecipeList({ searchTerm = "" }) {
  const { isAuthenticated, token, user } = useAuth();

  const [recettes, setRecettes] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filteredRecipes = recettes.filter((recette) => {
    const name = recette.name ?? "";
    const query = searchTerm ?? "";
    return name.toLowerCase().includes(query.toLowerCase());
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getRecettes();
        setRecettes(data);

        if (isAuthenticated && user?.username) {
          const favRows = await getFavoritesByUser(user.username, token);
          const ids = new Set(
            (favRows ?? [])
              .map(row => row?.recipe?.id)
              .filter(Boolean)
          );
          setFavoriteIds(ids);
        } else {
          setFavoriteIds(new Set());
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isAuthenticated, token, user?.username]);

  if (loading) return <p style={styles.loading}>Chargement des recettes...</p>;
  if (error) return <p style={styles.error}>❌ Erreur : {error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Toutes nos recettes</h1>

      <p style={styles.subtitle}>
        {filteredRecipes.length} recette(s) trouvée(s)
      </p>

      <div style={styles.grid}>
        {filteredRecipes.map((recette) => (
          <RecipeCard
            key={recette.id}
            recette={recette}
            isFavorite={favoriteIds.has(recette.id)}
          />
        ))}
      </div>
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