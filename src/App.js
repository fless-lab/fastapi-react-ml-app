import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useState } from 'react';

// Import your components
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Infos from './pages/Infos';

function App() {
  // Set the authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Define a function to handle logout
  const handleLogout = () => {
    // Perform the logout logic here (e.g., send a request to the server to revoke the token)
    // After successful logout, update the isLoggedIn state to false
    setIsLoggedIn(false);
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route exact path="/infos" element={<Infos />} />

          {/* Protected Route */}
          <Route
            exact
            path="/"
            element={
              isLoggedIn ? (
                <Home handleLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            exact
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route exact path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
