import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup, Polyline} from 'react-leaflet';
import L from 'leaflet';
import './map.css';


const c = require('./constants')

const stamenTiles = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
const stamenAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const mapCenter = [3.430283815687804, 283.48211288452154];
const zoomLevel = 12;

const favPlaces = new L.Icon({
    iconUrl: require('./images/marker.svg'),
    iconSize: new L.Point(25, 25),
    className: 'leaflet-div-icon'
}) 

const setPoint = new L.icon({
    iconUrl: require('./images/setPlace.svg'),
    iconSize: new L.point(25,25),
    className: 'leaflet-div-icon'
})

const origin = new L.icon({
    iconUrl: require('./images/origin.svg'),
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
            origin: {
                lat: this.props.origin.lat,
                lng: this.props.origin.lng
            },
            markers: this.props.markers,
            modoObtener: this.props.modoobtener === "true",
            linea: this.props.linea === "true"
        }
    }
    componentWillMount(){
        const modo = (this.props.modoobtener === "true")
        const linea = (this.props.linea === "true")
        this.setState({ modoObtener: modo, linea: linea})
    }
    handleClick = (e) => {
        console.log(e.latlng)
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
                    { this.state.punto && this.state.modoObtener &&
                    <Marker
                        onClick={this.handleClick}
                        position={this.state.punto}
                        draggable={true}
                        icon={setPoint}>
                    <Popup onClick={this.handleClick} position={this.state.punto}>¿Seguro? Punto: <pre>{JSON.stringify(this.state.punto, null, 2)}</pre></Popup>
                    </Marker>}
                    { this.state.origin.lat !== -1 ? <Marker position={this.state.origin} icon={origin}></Marker> : <div></div> }
                    {this.state.markers.map((data, id) =>  <Marker key={'marker-'+id} position={[data.point.x,data.point.y]} icon={favPlaces}><Popup>
                        <span> {data.namecoordinate} </span></Popup></Marker>)}
                    { this.state.linea ? <Polyline style={c.line} color='purple' positions={[[this.state.markers[0].point.x,this.state.markers[0].point.y],this.state.origin]}/>: <div></div>}
                </Map>
                </center>
            </div>
        );
    }
}


export default LMap;