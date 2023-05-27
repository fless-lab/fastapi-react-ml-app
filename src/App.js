import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Infos from "./pages/Infos";
import Header from "./pages/components/Header";
import TitanicSurvivor from "./pages/TitanicSurvivor";
import ImageCropper from "./pages/ImageCropper";

const PrivateOutlet = () => {
  const [authenticated, setAuthenticated] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setAuthenticated(!!token);
  }, []);

  return authenticated ? (
    <>
      <Header />
      <div style={{ marginTop: '100px', textAlign: 'center' }}>
      <Outlet />
      </div>
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  return (
    <div style={{ marginTop: "1rem" }}>
      <Router>
        <Routes>
          <>
            <Route exact path="/" element={<PrivateOutlet />}>
              <Route exact path="/" element={<Home />} />
            </Route>
            <Route exact path="/titanic-survivor" element={<PrivateOutlet />}>
            <Route exact path="/titanic-survivor" element={<TitanicSurvivor />} />
            </Route>
            <Route exact path="/image-cropper" element={<PrivateOutlet />}>
            <Route exact path="/image-cropper" element={<ImageCropper />} />
            </Route>
          </>

          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
            <Route exact path="/infos" element={<Infos />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
