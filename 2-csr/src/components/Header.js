import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header({ toggleSidebar }) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    
    <header style={styles.header}>
      <button className="menu-btn" onClick={toggleSidebar}>
        ☰
      </button>

      <h1>🍲 Recettes</h1>
      <img 
        src="/cuisine.jpeg" 
        alt="Cuisine" 
        style={styles.image}
      />
      <nav style={styles.nav}>
        <a href="/" style={styles.link}>Accueil</a>
        {isAuthenticated && (
          <a href="/favorites" style={styles.link}>Mes favoris</a>
        )}
        {isAuthenticated ? (
          <div style={styles.userSection}>
            <span>Bonjour {user?.username}</span>
            <button onClick={handleLogout} style={styles.button}>
              Déconnexion
            </button>
          </div>
        ) : (
          <a href="/login" style={styles.link}>Connexion</a>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: 'white',
    borderBottom: '2px solid #ffffff',
    padding: '1rem',
  },
  image: {
    width: '100%',
    maxHeight: '200px',
    objectFit: 'cover',
    objectPosition: 'center -75px',
    borderRadius: '8px',
  },
  nav: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    marginTop: '1rem',
    padding: '0.5rem 0',
  },
  link: {
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: '500',
    fontSize: '1.1rem',
  },
  userSection: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f1f1f1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
  },
};