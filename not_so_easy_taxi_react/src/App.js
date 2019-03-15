import React, { Component } from 'react';
import { Map, TileLayer } from 'react-leaflet';

const stamenTiles = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
const stamenAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const mapCenter = [39.9528, -75.1638];
const zoomLevel = 12;



class App extends Component {
    doSomething = (e) =>{
        console.log(e.latlng)
      }
    render() {
        return (
            <div>
                <center>
                <p>Nuestro hermoso proyecto :) </p>
                <Map
                    center={mapCenter}
                    zoom={zoomLevel}
                    animate={true}
                    onClick={this.doSomething}
                    >
                    <TileLayer
                        attribution={stamenAttr}
                        url={stamenTiles}
                    />
                </Map>
                </center>
            </div>
        );
    }
}


export default App;


