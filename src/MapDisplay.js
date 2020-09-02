import React, {Component} from 'react';
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup, Circle, CircleMarker } from "react-leaflet";


export default class SimpleExample extends Component {
  state = {
    lat: 51.505,
    lng: -0.09,
    zoom: 5,
  };

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <Map id="mapid" center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />
        <Circle center={this.state} fillColor="blue" radius={200} />
        <CircleMarker center={[51.51, -0.12]} color="red" radius={20}>
          <Popup>Popup in CircleMarker</Popup>
        </CircleMarker>
      </Map>
    );
  }
}