import React, { useState } from 'react';
import Header from './components/Header';

function TitanicSurvivor() {
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [pclass, setPclass] = useState('');
  const [prediction, setPrediction] = useState('');
  const [isAlive, setIsAlive] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('access_token');
  
      if (!token) {
        setError('Vous devez être connecté pour effectuer cette prédiction.');
        return;
      }
  
      const response = await fetch('http://localhost:8000/api/survivor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          age: Number(age),
          sex: Number(sex),
          pclass: Number(pclass),
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setPrediction(data.survived);
        setIsAlive(data.prediction === 1);
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
        <h1>Titanic Survivor</h1>
        <form className="ui form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Sex</label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="0">Female</option>
              <option value="1">Male</option>
            </select>
          </div>
          <div className="field">
            <label>Class</label>
            <select
              value={pclass}
              onChange={(e) => setPclass(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="1">1st Class</option>
              <option value="2">2nd Class</option>
              <option value="3">3rd Class</option>
            </select>
          </div>
          <button className="ui green button" type="submit">
            Procéder à la prédiction
          </button>
        </form>
        {error && <div className="ui message">{error}</div>}
        {prediction && (
          <div className={`ui message ${isAlive ? 'green' : 'red'}`}>
            <p>{prediction}</p>
            {/* <p>{isAlive ? 'Bonne nouvelle ! Ce passager est en vie.' : 'Désolé ! Ce passager est mort.'}</p> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default TitanicSurvivor;
