import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';


function Header() {
    const navigate = useNavigate();
  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '10px',zIndex:"10" }}>
      <div className="ui container">
        <div className="ui menu">
          <div className="header item">
            ML Model Tester
          </div>
          <div className="item">
            <NavLink exact to="/" activeClassName="active">Accueil</NavLink>
          </div>
          <div className="item">
            <NavLink exact to="/titanic-survivor" activeClassName="active">Titanic survivor</NavLink>
          </div>
          <div className="item">
            <NavLink exact to="/image-cropper" activeClassName="active">Image Cropper</NavLink>
          </div>
          <div className="item">
            <NavLink exact to="/weight-predictor" activeClassName="active">Weight Predictor</NavLink>
          </div>
          <div className="right menu">
            <div className="item">
              <button className="ui red button" onClick={() => {
                localStorage.removeItem('access_token');
                navigate("/login");
              }}>Déconnexion</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
