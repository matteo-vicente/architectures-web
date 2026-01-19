import React from "react";

export default function Navbar({ toggleSidebar }) {
  return (
    <header className="navbar">
      <button className="menu-btn" onClick={toggleSidebar}>
        ☰
      </button>
      <h1>🍲 Recettes</h1>
    </header>
  );
}