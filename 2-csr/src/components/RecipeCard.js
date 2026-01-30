import { useAuth } from '../context/AuthContext';
import { addToFavorites, removeFromFavorites } from '../services/api';
import { useState } from 'react';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function RecipeCard({ recette, isFavorite = false, onFavoriteChange }) {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [favorite, setFavorite] = useState(isFavorite);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Vous devez être connecté pour gérer vos favoris');
      return;
    }

    if (!user?.username) {
      alert("Ton username n'est pas disponible. Déconnecte-toi puis reconnecte-toi.");
      return;
    }

    setLoading(true);
    try {
      if (favorite) {
        await removeFromFavorites(user.username, recette.id, token);
        setFavorite(false);
      } else {
        await addToFavorites(user.username, recette.id, token);
        setFavorite(true);
      }

      if (onFavoriteChange) onFavoriteChange();
    } catch (error) {
      alert('Erreur : ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        ...styles.card,
        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
        boxShadow: isHovered
          ? '0 10px 28px rgba(0,0,0,0.15)'
          : '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
      }}
      onClick={() => navigate(`/recettes/${recette.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {recette.image_url && (
        <img
          src={recette.image_url}
          alt={recette.name}
          style={{
            ...styles.image,
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 0.3s ease',
          }}
        />
      )}

      <div style={styles.content}>
        <h3 style={styles.title}>{recette.name}</h3>

        <p style={styles.description}>
          {recette.description ? `${recette.description.substring(0, 100)}...` : ""}
        </p>

        <div style={styles.meta}>
          {recette.prep_time > 0 && (
            <span style={styles.metaItem}>
              ⏱️ {recette.prep_time + recette.cook_time} min
            </span>
          )}
          {recette.servings > 0 && (
            <span style={styles.metaItem}>
              👥 {recette.servings} pers.
            </span>
          )}
        </div>

        {isAuthenticated && (
          <button
            onClick={handleFavoriteClick}
            disabled={loading}
            style={{
              ...styles.favoriteButton,
              backgroundColor: favorite ? '#ff6b6b' : '#51cf66',
            }}
          >
            {loading ? '...' : favorite ? '❤️ Retirer' : '🤍 Ajouter'}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  content: {
    padding: '1.5rem',
  },
  title: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.25rem',
    color: '#333',
  },
  description: {
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '1rem',
  },
  meta: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    fontSize: '0.9rem',
    color: '#666',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  favoriteButton: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    color: 'white',
    fontWeight: '500',
    transition: 'opacity 0.2s',
  },
};

