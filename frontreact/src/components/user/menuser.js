import React, { Component } from 'react';
import LMap from '../map'
import car from '../images/logo.png'
import { Modal, Button, ButtonGroup, Card, CardDeck } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import './menuser.css'
import Axios from 'axios';
import Service from './service'
import KmUsed from '../km'

const backColor = {
    backgroundColor: '#731E6F',
};

const pad = {
    margin: 5,
    align: 'center',
    backgroundColor: '#21387C',
    border:'#21387C',
    font: 'white'
}

const grayRgb = {
    backgroundColor: 'rgb(148, 150, 172)',
}

const api = "http://localhost:4000";
class Menuser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            cellphone: this.props.location.state.cellphone,
            showModal: false,
            showModalKm: false,
            point : {
                lat: 1.0,
                lng: 1.0,
            },
            origin: {
                lat: 0,
                lng: 0
            },
            markers: []
        }
        this.showMap = this.showMap.bind(this);
        this.getService = this.getService.bind(this);
        this.gokmUsed = this.gokmUsed.bind(this);
    }
    componentWillMount(){
        Axios.get(api+"/Usuario?cellphone="+this.state.cellphone)
        .then( response => {
            if( response.data.error != null){
                alert(response.data.error);
            }
            else{
                this.setState({ name: response.data.name})
            }
        }).catch(error => alert(error))
        //origen
        Axios.get(api+"/Origen?cellphone="+this.state.cellphone)
        .then( response => {
            if( response.data.error != null){
               alert(response.data.error);
            }
            else{
                this.setState({origin: { lat: response.data.origin.x, lng: response.data.origin.y}});
            }            
        }).catch(error => alert(error))
        //lugares favoritos
        Axios.get(api+"/LugaresFavoritos?cellphone="+this.state.cellphone)
        .then( response => {
            if( response.data.error != null){
                alert(response.data.error);
            }
            else{
                this.setState({markers: response.data});
            }
        }).catch(error => alert(error))
    }
    showMap(){
        this.setState({
            showMap: !this.state.showMap
        })
    }
    callbackMap(inputPoint){
        this.setState({
            point:{ lat: inputPoint.lat, lng: inputPoint.lng}
        })
    }
    getService(){
        this.setState( { showModal: !this.state.showModal})
    }
    gokmUsed(){
        this.setState({ showModalKm: !this.showModalKm})
    }
    render() {
        let modalClose = () => this.setState({ showModal: false});
        let modalCloseKm = () => this.setState({ showModalKm: false});
        return (
            <div style={backColor} className="menuser">
            <Modal.Dialog  size='lg' centered>
            <Modal.Body style={grayRgb}>
                <CardDeck>
                    <Card style={grayRgb} >
                        <center>
                        <h2> <img alt='' src={car}/> Menu Usuario</h2> 
                        <h6> Datos: { this.state.name}, {this.state.cellphone}</h6>
                        <div>
                        <ButtonGroup vertical>
                        <Button style={pad} onClick={this.gokmUsed} >Kilometros Recorridos</Button>
                        <Button style={pad}>Historial</Button>
                        <Button style={pad}>Modificar Información</Button>
                        <Button onClick={this.getService} style={pad}>Solicitar Servicio!</Button>
                        <Button style={pad}>Eliminar Cuenta</Button>
                        <Button style={pad}>Agregar Lugar Favorito</Button>
                        <Button style = {{    margin: 5, align: 'center'}} href='/' variant="danger">Cerrar Sección</Button>
                        </ButtonGroup>
                        <p>latitud: {this.state.point.lat}, longitud: {this.state.point.lng}</p>
                        </div>
                        <Button style = {{ margin: 5}} onClick={this.showMap} variant="success" className="float-right">Ver Mapa</Button>
                        </center>
                    </Card>
                    { this.state.showMap === true ? <Card style={grayRgb}> 
                    <LMap height={'500px'} width={'100%'} markers={this.state.markers.coordinates} origin={this.state.origin} point = { value => this.callbackMap(value)} modoObtener={false}/> </Card> : <div></div>}
                </CardDeck>
            </Modal.Body>
            </Modal.Dialog>
            <KmUsed show={this.state.showModalKm} cellphone={this.state.cellphone} onHide={modalCloseKm}/>
            <Service show={this.state.showModal} cellphone={this.state.cellphone} firstpoint={this.state.origin} favcoordinates={this.state.markers.coordinates} onHide={modalClose}/>
        </div>
        );
    }
}


export default withRouter(Menuser);
