

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState(3);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullname, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { access_token } = data;
        localStorage.setItem('access_token', access_token);

        setShowSuccessMessage(true);
        startRedirectTimer();
      } else {
        const { detail } = data;
        setError(detail);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }

    setIsSubmitting(false);
  };

  const startRedirectTimer = () => {
    const timer = setInterval(() => {
      setRedirectTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(timer);
  };

  useEffect(() => {
    if (showSuccessMessage && redirectTimer === 0) {
      navigate('/login');
    }
  }, [showSuccessMessage, redirectTimer, navigate]);

  return (
    <div className="page-login">
    <div className="ui centered grid container">
      <div className="nine wide column">
        <div className="ui icon info message">
          <i className="user icon"></i>
          <div className="content">
            <div className="header">Bienvenue !</div>
            <p>Pour commencer, veuillez vous inscrire en saisissant vos informations personnelles !</p>
          </div>
        </div>
        <div className="ui fluid card">
          <div className="content">
            {showSuccessMessage ? (
              <div className="ui success message">
                <div className="header">Inscription réussie.</div>
                <p>Vous serez redirigé dans {redirectTimer} secondes...</p>
              </div>
            ) : (
              <form className="ui form" onSubmit={handleSubmit}>
                <div className="field">
                  <label>Nom & Prénoms</label>
                  <input
                    type="text"
                    name="fullname"
                    placeholder="John Doe"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label>Nom d'utilisateur ou email</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="user"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label>Mot de passe</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="password"
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
                  <i className="user alternate icon"></i>
                  S'inscrire
                </button>
              </form>
            )}
            {error && <div className="ui red message">{error}</div>}
            <div className="ui bottom attached message" style={{ marginTop: '1rem' }}>
              <i className="icon help"></i>
              Déjà inscrit ? <Link to="/login">Connectez-vous ici</Link> plutôt.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default Register;

