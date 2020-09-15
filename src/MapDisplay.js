import React, { useEffect, useRef } from "react";
import { Map, TileLayer, Popup, Circle, CircleMarker } from "react-leaflet";

let MapDisplay = ({ response, loaded, search, eqNumber }) => {
  const popupRef = useRef([]);
  const initPos = {
    lat: 30,
    lng: -50,
    zoom: 2,
  };

  //Clicking sidepanel EQs will open a popup on map, using eqNumber variable
  useEffect(() => {
    if (
      loaded &&
      eqNumber != null &&
      popupRef.current[eqNumber].leafletElement
    ) {
      popupRef.current[eqNumber].leafletElement.openPopup();
      // console.log(popupRef.current[eqNumber]);
    }
  }, [loaded, eqNumber]);

  return (
    <Map id="mapid" center={[initPos.lat, initPos.lng]} zoom={initPos.zoom}>
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
              ref={(el) => (popupRef.current[idx] = el)}
              center={[eq.geometry.coordinates[1], eq.geometry.coordinates[0]]}
              color="red"
              radius={
                (eq.properties.mag - search.mag) * 20 +
                10 +
                (eq.properties.mag ^ 2)
              }
            >
              <Popup>
                <div className="popup">
                  {`Magnitude ${eq.properties.mag}, ${eq.properties.place}`}
                  <br />
                  {`Recorded ${new Date(eq.properties.time).toLocaleString(
                    "en-GB",
                    {
                      timeZone: "UTC",
                    }
                  )} UTC`}
                  <br />
                  <a
                    style={{ textAlign: "center" }}
                    target="_blank"
                    href={
                      "https://earthquake.usgs.gov/earthquakes/eventpage/" +
                      eq.id
                    }
                  >
                    Learn more (USGS)
                  </a>
                </div>
              </Popup>
            </CircleMarker>
          </React.Fragment>
        ))}
    </Map>
  );
};

export default MapDisplay;
