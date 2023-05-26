import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '10px' }}>
        <div className="ui container">
          <div className="ui menu">
            <div className="header item">
              ML Model Tester
            </div>
            <div className="item">
              <Link to="/">Accueil</Link>
            </div>
            <div className="item">
              <a href="#">Model3</a>
            </div>
            <div className="item">
              <a href="#">Model2</a>
            </div>
            <div className="item">
              <a href="#">Model3</a>
            </div>
            <div className="right menu">
              <div className="item">
                <button className="ui red button">Déconnexion</button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div style={{ marginTop: '100px', textAlign: 'center' }}>
        <h1>Bienvenu !</h1>
      </div>
    </div>
  );
}

export default Home;