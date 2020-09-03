import React, {Component, useState, useEffect, useContext} from 'react';
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup, Circle, CircleMarker } from "react-leaflet";
import {SearchContext} from './SearchContext';


let MapShow = (props) => {
  const[response, setResponse] = useState();
  const[loaded, setLoaded] = useState();
  const{search, setSearch} = useContext(SearchContext);
  // const[value, setValue] = useState();

  useEffect(() => {(
    async() => {
      let data = await fetch(
        `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${search.from}&endtime=${search.to}&minmagnitude=${search.mag}`
      );
      let body = await data.json()
      setResponse(body.features);
      setLoaded(true);
    })()
  }, [search])

  useEffect(() => {
    console.log(response)
  }, [response])

      props.quakeCountMeth(30);


  const [initPos, setInitPos] = useState({
    lat: 0,
    lng: 0,
    zoom: 2,
  })

  const [position, setPosition] = useState([initPos.lat, initPos.lng])

    return (
      <Map id="mapid" center={position} zoom={initPos.zoom}>
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />
        {/* <CircleMarker center={[51.51, -0.12]} color="red" radius={20}>
          <Popup>Earthquake</Popup>
        </CircleMarker> */}
        {loaded &&
          response?.map((eq) => (
            <React.Fragment>
              <Circle
                center={[
                  eq.geometry.coordinates[1],
                  eq.geometry.coordinates[0],
                ]}
                fillColor="blue"
                radius={200}
                key={"cc" + eq.id}
              />
              <CircleMarker
                center={[
                  eq.geometry.coordinates[1],
                  eq.geometry.coordinates[0],
                ]}
                key={"mk" + eq.id}
                color="red"
                radius={(eq.properties.mag - search.mag) * 20 + 5}
              >
                <Popup>
                  {new Date(eq.properties.time).toString()}
                  <br />
                  <a target="_blank" href={"https://earthquake.usgs.gov/earthquakes/eventpage/" + eq.id}>Earthquake:</a>{" "}
                  {eq.properties.mag}, {eq.properties.place}
                </Popup>
              </CircleMarker>
            </React.Fragment>
          ))}
      </Map>
    );
  
}

export default MapShow;