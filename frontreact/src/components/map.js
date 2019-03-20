import React, { Component } from 'react';
import { Map, TileLayer } from 'react-leaflet';

const stamenTiles = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
const stamenAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const mapCenter = [39.9528, -75.1638];
const zoomLevel = 12;

class LMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            punto : {
                lat: 1.0,
                lng: 1.0,
            }
        }
    }
    doSomething = (e) => {
        this.setState({ punto: {lat:e.latlng.lat, lng:e.latlng.lng}});
        console.log(this.punto)
      }
    render() {
        const {punto} = this.state
        return (
            <div>
                <center>
                    <h6> Punto: {punto.lat}, {punto.lng} </h6>
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


export default LMap;