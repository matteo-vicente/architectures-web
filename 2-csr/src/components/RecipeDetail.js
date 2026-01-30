import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecette, addToFavorites, removeFromFavorites, getFavoritesByUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated, user } = useAuth();
  const [recette, setRecette] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    async function fetchFavoriteState() {
      if (!isAuthenticated || !user?.username) return;

      try {
        const favRows = await getFavoritesByUser(user.username, token);
        const ids = new Set(
          (favRows ?? []).map(row => row?.recipe?.id).filter(Boolean)
        );
        setIsFavorite(ids.has(id)); // id vient de useParams (string)
      } catch (e) {
        // optionnel: console.warn(e)
      }
    }

    fetchFavoriteState();
  }, [id, isAuthenticated, token, user?.username]);

  useEffect(() => {
    async function fetchRecette() {
      try {
        const data = await getRecette(id);
        setRecette(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecette();
  }, [id]);

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      alert('Vous devez être connecté');
      navigate('/login');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await removeFromFavorites(user.username, recette.id, token);
        setIsFavorite(false);
      } else {
        await addToFavorites(user.username, recette.id, token);
        setIsFavorite(true);
      }
    } catch (error) {
      alert('Erreur : ' + error.message);
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) return <div style={styles.loading}>Chargement...</div>;
  if (error) return <div style={styles.error}>❌ Erreur : {error}</div>;
  if (!recette) return <div style={styles.error}>Recette non trouvée</div>;

  // Convertir les instructions (string avec \n) en array
  const instructions = recette.instructions ? recette.instructions.split('\n').filter(line => line.trim()) : [];

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/')} style={styles.backButton}>
        ← Retour à la liste
      </button>
      
      <div style={styles.header}>
        <h1 style={styles.title}>{recette.name}</h1>
        {isAuthenticated && (
          <button 
            onClick={handleFavoriteClick}
            disabled={favoriteLoading}
            style={{
              ...styles.favoriteButton,
              backgroundColor: isFavorite ? '#ff6b6b' : '#51cf66'
            }}
          >
            {favoriteLoading ? '...' : isFavorite ? '❤️ Retirer des favoris' : '🤍 Ajouter aux favoris'}
          </button>
        )}
      </div>

      {recette.category && (
        <div style={styles.badge}>{recette.category}</div>
      )}
      
      {recette.image_url && (
        <img 
          src={recette.image_url} 
          alt={recette.name} 
          style={styles.image}
        />
      )}

      <div style={styles.metaContainer}>
        {recette.prep_time > 0 && (
          <div style={styles.metaCard}>
            <span style={styles.metaIcon}>⏱️</span>
            <div>
              <div style={styles.metaLabel}>Préparation</div>
              <div style={styles.metaValue}>{recette.prep_time} min</div>
            </div>
          </div>
        )}
        {recette.cook_time > 0 && (
          <div style={styles.metaCard}>
            <span style={styles.metaIcon}>🔥</span>
            <div>
              <div style={styles.metaLabel}>Cuisson</div>
              <div style={styles.metaValue}>{recette.cook_time} min</div>
            </div>
          </div>
        )}
        {recette.servings > 0 && (
          <div style={styles.metaCard}>
            <span style={styles.metaIcon}>👥</span>
            <div>
              <div style={styles.metaLabel}>Portions</div>
              <div style={styles.metaValue}>{recette.servings}</div>
            </div>
          </div>
        )}
      </div>
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📝 Description</h2>
        <p style={styles.text}>{recette.description}</p>
      </div>
      
      {instructions.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>👨‍🍳 Instructions</h2>
          <ol style={styles.list}>
            {instructions.map((instruction, index) => (
              <li key={index} style={styles.listItem}>{instruction}</li>
            ))}
          </ol>
        </div>
      )}

      {recette.when_to_eat && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🍽️ Quand manger ce plat ?</h2>
          <p style={styles.text}>{recette.when_to_eat}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem',
  },
  backButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginBottom: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: '2.5rem',
    margin: 0,
    color: '#333',
  },
  badge: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '500',
    marginBottom: '1.5rem',
  },
  favoriteButton: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '500',
  },
  image: {
    width: '100%',
    maxHeight: '500px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '2rem',
  },
  metaContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  metaCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  metaIcon: {
    fontSize: '2rem',
  },
  metaLabel: {
    fontSize: '0.85rem',
    color: '#666',
  },
  metaValue: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: '2.5rem',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '1.75rem',
    marginBottom: '1rem',
    color: '#333',
  },
  text: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: '#555',
  },
  list: {
    fontSize: '1.1rem',
    lineHeight: '2',
    color: '#555',
    paddingLeft: '1.5rem',
  },
  listItem: {
    marginBottom: '0.75rem',
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