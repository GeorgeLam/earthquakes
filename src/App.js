import React from 'react';
import logo from './logo.svg';
import './App.css';
import MapDisplay from './MapDisplay';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <div className="App">
      <MapDisplay/>
    </div>
  );
}

export default App;
