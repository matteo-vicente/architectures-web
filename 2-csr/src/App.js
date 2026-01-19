// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import Favorites from './components/Favorites';
import LoginForm from './components/LoginForm';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import "./App.css";

function App() {

  const [isOpen, setIsOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
      {/* Sidebar TOUJOURS montée */}
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <div style={styles.app}>
          {/* Header reçoit le bouton ☰ */}
          {/* <Header toggleSidebar={toggleSidebar} /> */}
          <Header 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            toggleSidebar={() => setIsOpen(!isOpen)} />
          {/* <Header /> */}
          <main style={styles.main}>
            <Routes>
              {/* <Route path="/" element={<RecipeList />} /> */}
              <Route path="/" element={<RecipeList searchTerm={searchTerm} />} />
              <Route path="/recettes/:id" element={<RecipeDetail />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/login" element={<LoginForm />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  main: {
    minHeight: 'calc(100vh - 300px)',
  },
};

export default App;
