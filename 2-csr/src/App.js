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

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import Favorites from './components/Favorites';
import LoginForm from './components/LoginForm';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={styles.app}>
          <Header />
          <main style={styles.main}>
            <Routes>
              <Route path="/" element={<RecipeList />} />
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
