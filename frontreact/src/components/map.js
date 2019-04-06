import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup} from 'react-leaflet';
import L from 'leaflet';

const stamenTiles = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
const stamenAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const mapCenter = [3.430283815687804, 283.48211288452154];
const zoomLevel = 12;

const favPlaces = new L.Icon({
    iconUrl: require('./images/marker.svg'),
    iconSize: new L.point(25,25),
    className: 'leaflet-div-icon'
}) 

const setPoint = new L.icon({
    iconUrl: require('./images/setPlace.svg'),
    iconSize: new L.point(25,25),
    className: 'leaflet-div-icon'
})


class LMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size :{
                height : this.props.height,
                width : this.props.width,
            },
            punto : {
                lat: mapCenter[0],
                lng: mapCenter[1],
            },
            markers: this.props.markers,
            modoObtener: this.props.modoObtener //pruebas
        }
    }
    handleClick = (e) => {
        this.setState({ punto: {lat:e.latlng.lat, lng:e.latlng.lng}});
        this.props.point(this.state.punto)
    }
    render() {
        return (
            <div>
                <center>
                <Map
                    style = {{height: this.state.size.height, width: this.state.size.width}}
                    center={mapCenter}
                    zoom={zoomLevel}
                    onClick={this.handleClick}>
                    <TileLayer
                        attribution={stamenAttr}
                        url={stamenTiles}
                    />
                    {/*Este es para poner puntos y guardarlos*/}
                    { this.state.punto && this.state.modoObtener &&
                    <Marker
                        onClick={this.handleClick}
                        position={this.state.punto}
                        draggable={true}
                        icon={setPoint}>
                    <Popup onClick={this.handleClick} position={this.state.punto}>¿Seguro? Punto: <pre>{JSON.stringify(this.state.punto, null, 2)}</pre></Popup>
                    </Marker>}
                    {/*Este es para posicion actual solo usuarios deberian tenerlo*/}
                    {/*<Marker></Marker>*/}
                    {this.state.markers.map((data, id) =>  <Marker key={'marker-'+id} position={[data.point.x,data.point.y]} icon={favPlaces}><Popup>
                        <span> {data.namecoordinate} </span></Popup></Marker>)}
                </Map>
                </center>
            </div>
        );
    }
}


export default LMap;