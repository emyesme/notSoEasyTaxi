import React, { Component } from 'react';
import LMap from '../map'
import car from '../images/logo.png'
import { Modal, Button, ButtonGroup, Card, CardDeck } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import './menuser.css'
import Axios from 'axios';

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
            point : {
                lat: 1.0,
                lng: 1.0,
            },
            markers: []
        }
        this.favCoordinates = this.favCoordinates.bind(this)
        this.showMap = this.showMap.bind(this)
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
    favCoordinates(){

    }
    showMap(){
        this.setState({
            showMap: !this.state.showMap
        })
    }
    callback (inputPoint){
        this.setState({
            point:{ lat: inputPoint.lat, lng: inputPoint.lng}
        })
    }
    render() {
        return (
            <div style={backColor} className="menuser">
            <Modal.Dialog  size='lg'>
            <Modal.Body style={grayRgb}>
                <CardDeck>
                    <Card style={grayRgb} >
                        <center>
                        <h2> <img alt='' src={car}/> Menu Usuario</h2> 
                        <h6> Datos: { this.state.name}, {this.state.cellphone}</h6>
                        <div>
                        <ButtonGroup vertical>
                        <Button style={pad}>Kilometros Recorridos</Button>
                        <Button style={pad}>Historial</Button>
                        <Button style={pad}>Modificar Información</Button>
                        <Button href="/Servicio" style={pad}>Solicitar Servicio!</Button>
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
                    <LMap height={'500px'} width={'100%'} markers={this.state.markers.coordinates} point = { value => this.callback(value)}/> </Card> : <div></div>}
                </CardDeck>
            </Modal.Body>
            </Modal.Dialog>
        </div>
        );
    }
}


export default withRouter(Menuser);
