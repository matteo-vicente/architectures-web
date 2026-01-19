import { useState, useEffect } from 'react';
import { getRecettes } from '../services/api';
import RecipeCard from './RecipeCard';

export default function RecipeList() {
  const [recettes, setRecettes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecettes() {
      try {
        const data = await getRecettes();
        setRecettes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecettes();
  }, []);

  if (loading) {
    return (
      <div style={styles.loading}>
        <p>Chargement des recettes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.error}>
        <p>❌ Erreur : {error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Toutes nos recettes</h1>
      <p style={styles.subtitle}>{recettes.length} recettes disponibles</p>
      
      <div style={styles.grid}>
        {recettes.map((recette) => (
          <RecipeCard key={recette.id} recette={recette} />
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