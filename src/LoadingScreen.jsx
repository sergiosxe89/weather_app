// LoadingScreen.jsx
import React from 'react';
import './LoadingScreen.css';

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p>Cargando...</p>
    </div>
  );
}

export default LoadingScreen;