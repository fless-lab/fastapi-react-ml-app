import React, { useState } from 'react';
import Header from './components/Header';

function WeightPredictor() {
  const [height, setHeight] = useState('');
  const [prediction, setPrediction] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setError('Vous devez être connecté pour effectuer cette prédiction.');
        return;
      }

      const response = await fetch('http://localhost:8000/api/weight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taille: parseFloat(height),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPrediction(data.prediction);
      } else {
        setError('Une erreur s\'est produite. Veuillez réessayer.');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Token invalide. Veuillez vous connecter à nouveau.');
      } else {
        setError('Une erreur s\'est produite. Veuillez réessayer.');
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="centered-form" style={{ width: '50%', margin: 'auto' }}>
        <h1>Weight Predictor</h1>
        <form className="ui form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Height (m)</label>
            <input
              type="number"
              step="0.01"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
            />
          </div>
          <button className="ui green button" type="submit">
            Proceed to Prediction
          </button>
        </form>
        {error && <div className="ui message">{error}</div>}
        {prediction && (
          <div className="ui message">
            <p>Prediction: {prediction} kg</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeightPredictor;
