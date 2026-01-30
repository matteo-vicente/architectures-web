import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';


export default function Header({ toggleSidebar, searchTerm, setSearchTerm }) {

  const { user, token, logout, isAuthenticated } = useAuth();
  console.log("AUTH CONTEXT →", { user, token, isAuthenticated });

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

      {/* HERO IMAGE */}
      <div style={styles.hero}>
        <img
          src="/cuisine.jpeg"
          alt="Cuisine"
          style={styles.image}
        />

        <div style={styles.overlay}></div>

        <h1 style={styles.title}>Recettes de cuisine</h1>

        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Quelle est votre envie du jour ?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* NAVIGATION */}
      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>Accueil</Link>

        {isAuthenticated && (
          <Link to="/favorites" style={styles.link}>Mes favoris</Link>
        )}

        {isAuthenticated ? (
          <div style={styles.userSection}>
            <span>Bonjour {user?.username}</span>
            <button onClick={handleLogout} style={styles.button}>
              Déconnexion
            </button>
          </div>
        ) : (
          <Link to="/login" style={styles.link}>Connexion</Link>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: 'white',
  },

  hero: {
    position: 'relative',
    width: '100%',
    height: '300px',
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center 10%',
    borderRadius: '0',
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 90%)',
    zIndex: 1,
  },

  title: {
    position: 'absolute',
    bottom: '6rem',
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'white',
    fontSize: '5rem',
    fontWeight: '700',
    zIndex: 2,
    textShadow: '0 2px 8px rgba(0,0,0,0.6)',
  },

  searchContainer: {
    position: 'absolute',
    top: '60%',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2,
    width: '80%',
    maxWidth: '500px',
  },

  searchInput: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '999px',
    border: 'none',
    fontSize: '1rem',
    outline: 'none',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
  },

  nav: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    padding: '1rem 2rem',
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
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};