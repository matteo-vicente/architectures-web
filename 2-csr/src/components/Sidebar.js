import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      {isOpen && <div className="overlay" onClick={toggleSidebar} />}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>✕</button>

        <nav>
          <ul>
            <li>
              <Link to="/" onClick={toggleSidebar}>🏠 Accueil</Link>
            </li>
            <li>
              <Link to="/favorites" onClick={toggleSidebar}>⭐ Favoris</Link>
            </li>
            <li>
              <Link to="/login" onClick={toggleSidebar}>🔐 Se connecter</Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
