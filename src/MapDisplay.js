import React, {
  Component,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import L from "leaflet";
import {
  Map,
  TileLayer,
  Marker,
  Popup,
  Circle,
  CircleMarker,
} from "react-leaflet";
import { SearchContext } from "./SearchContext";

let MapDisplay = ({ response, loaded, search, coord }) => {
  // const[value, setValue] = useState();
  const [initPos, setInitPos] = useState({
    lat: 0,
    lng: 0,
    zoom: 2,
  });

  const markerRef = useRef(null);

  const [position, setPosition] = useState([initPos.lat, initPos.lng]);
  useEffect(() => {
    console.log(coord);
  }, [coord]);

  const inputRef = useRef([]);

  // inputRef.current[idx].focus();

  useEffect(() => {
    console.log(markerRef.current);
    if (loaded && coord != null) {
      inputRef.current[coord].leafletElement.openPopup();
      console.log(inputRef.current[coord]);
    }
    // console.log(document);
  }, [loaded, coord]);

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
        response?.map((eq, idx) => (
          <React.Fragment key={eq.id}>
            <Circle
              center={[eq.geometry.coordinates[1], eq.geometry.coordinates[0]]}
              fillColor="blue"
              radius={200}
            />
            <CircleMarker
              ref={(el) => (inputRef.current[idx] = el)}
              center={[eq.geometry.coordinates[1], eq.geometry.coordinates[0]]}
              color="red"
              radius={(eq.properties.mag - search.mag) * 20 + 5}
            >
              <Popup>
                {new Date(eq.properties.time).toString()}
                <br />
                <a
                  target="_blank"
                  href={
                    "https://earthquake.usgs.gov/earthquakes/eventpage/" + eq.id
                  }
                >
                  Earthquake:
                </a>{" "}
                {eq.properties.mag}, {eq.properties.place}
              </Popup>
            </CircleMarker>
          </React.Fragment>
        ))}
    </Map>
  );
};

export default MapDisplay;
