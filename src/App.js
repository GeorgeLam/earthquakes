import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import MapDisplay from './MapDisplay';
import Page from './Page';
import 'leaflet/dist/leaflet.css';
import {SearchContext} from "./SearchContext";




function App() {
  const [search, setSearch] = useState({from: '', to: '', minmag: ''});
  return (
    <div className="App">
      <SearchContext.Provider value={{ search, setSearch }}>
        <Page />
      </SearchContext.Provider>
    </div>
  );
}

export default App;
