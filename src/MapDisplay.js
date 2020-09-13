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

let MapDisplay = ({ response, loaded, search, eqNumber }) => {
  // const[value, setValue] = useState();
  const [initPos, setInitPos] = useState({
    lat: 30,
    lng: -50,
    zoom: 2,
  });

  const markerRef = useRef(null);

  const [position, setPosition] = useState([initPos.lat, initPos.lng]);
  useEffect(() => {}, [eqNumber]);

  const inputRef = useRef([]);

  useEffect(() => {
    if (
      loaded &&
      eqNumber != null &&
      inputRef.current[eqNumber].leafletElement
    ) {
      inputRef.current[eqNumber].leafletElement.openPopup();
      // console.log(inputRef.current[eqNumber]);
    }
    // console.log(document);
  }, [loaded, eqNumber]);

  return (
    <Map id="mapid" center={position} zoom={initPos.zoom}>
      {/* <h1 className="impose">Hello</h1> */}
      <TileLayer
        attribution='&copy; <a href=\"https://www.jawg.io\" target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org\" target=\"_blank\">&copy; OpenStreetMap</a>&nbsp;contributors'
        url="https://tile.jawg.io/jawg-dark/{z}/{x}/{y}.png?access-token=wkT9l2CuSSkDtJbfNSTGt1CZ1RvUlyvEsQGPno7ZbYUEsanlOSnekOKji50GN34g"
      />

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
              radius={
                (eq.properties.mag - search.mag) * 20 +
                10 +
                (eq.properties.mag ^ 2)
              }
            >
              <Popup>
                {new Date(eq.properties.time).toLocaleString("en-GB", {
                  timeZone: "UTC",
                }) + " UTC"}
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
