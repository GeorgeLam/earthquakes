import React from 'react';
import logo from './logo.svg';
import './App.css';
import MapDisplay from './MapDisplay';
import Page from './Page';
import 'leaflet/dist/leaflet.css';



function App() {
  return (
    <div className="App">
      {/* <MapDisplay/> */}
      <Page/>
    </div>
  );
}

export default App;
