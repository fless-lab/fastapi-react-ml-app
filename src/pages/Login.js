import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
    const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { access_token } = data;
        // Store the access token in local storage or any other secure storage
        localStorage.setItem('access_token', access_token);
        setIsLoggedIn(true);
        // Use the <Navigate /> component to redirect
        navigate('/');
      } else {
        const { detail } = data;
        setError(detail);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="page-login">
      <div className="ui centered grid container">
        <div className="nine wide column">
          <div className="ui icon warning message">
            <i className="lock icon"></i>
            <div className="content">
              <div className="header">Connexion requise!</div>
              <p>Veuillez-vous authentifier avec votre nom d'utilisateur et mot de passe!</p>
            </div>
          </div>
          <div className="ui fluid card">
            <div className="content">
              <form className="ui form" onSubmit={handleSubmit}>
                <div className="field">
                  <label>Nom d''utilisateur ou email</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="User"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label>Mot de passe</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  className="ui primary labeled icon button"
                  type="submit"
                  disabled={isSubmitting}
                >
                  <i className="unlock alternate icon"></i>
                  Se connecter
                </button>
              </form>
              {error && <div className="ui red message">{error}</div>}
              <div className="ui bottom attached message" style={{ marginTop: '1rem' }}>
                <i className="icon help"></i>
                Pas de compte? <Link to="/register">Inscrivez-vous ici</Link> plutôt.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
