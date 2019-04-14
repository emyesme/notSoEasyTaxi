import React, { Component } from 'react';
import LMap from '../map'
import car from '../images/logo.png'
import { Modal, Button, ListGroup, ListGroupItem, Card, CardDeck } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import Axios from 'axios';
import Service from './service'
import KmUsed from '../km';
import History from '../historial';
import CreateFav from './createfav';
import DeleteFav from './deletefav';

const c = require('../constants')
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
            markers: [],
            origin: {
                lat: 0,
                lng: 0
            },
            showModalTable: false,
            showModalCreateFav: false,
            showModalDeleteFav: false
        }
        this.showMap = this.showMap.bind(this);
        this.getService = this.getService.bind(this);
        this.gokmUsed = this.gokmUsed.bind(this);
        this.goTable = this.goTable.bind(this);
        this.goChangeUser = this.goChangeUser.bind(this);
        this.addFav = this.addFav.bind(this);
        this.deleteFav = this.deleteFav.bind(this);
        this.pay = this.pay.bind(this);
    }
    addFav(){
        this.setState({ showModalCreateFav : true})
    }
    deleteFav(){
        this.setState({ showModalDeleteFav: true})
    }
    componentWillMount(){
        Axios.get(c.api+"/Usuario?cellphone="+this.state.cellphone)
        .then( response => {
            if( response.data.error != null){
                alert(response.data.error);
            }
            else{
                this.setState({ name: response.data.name})
            }
        }).catch(error => alert(error))
        //origen
        Axios.get(c.api+"/Origen?cellphone="+this.state.cellphone)
        .then( response => {
            console.log(response.data)
            if( response.data.error != null){
               alert(response.data.error);
            }
            else{
                this.setState({origin: { lat: response.data.origin.x, lng: response.data.origin.y}});
            }            
        }).catch(error => alert(error))
        //lugares favoritos
        Axios.get(c.api+"/LugaresFavoritos?cellphone="+this.state.cellphone)
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
    goTable(){
        this.setState({ showModalTable: !this.showModalTable})
    }
    goChangeUser(){
        this.props.history.push({
            pathname: '/ActualizarUsuario',
            state: { cellphone: this.state.cellphone}
        })
    }
    pay(){
        Axios.post(c.api+'/pagar',
        {
            cellphone: this.state.cellphone
        }).then( response => {
            if(typeof response.data.error !== "undefined"){
                alert(response.data.error)
            }
            else{
                alert("El pago de sus deudas ha sido registrado")
            }

        }).catch(error => alert(error))
    }
    render() {
        let modalCloseTable = () => this.setState({ showModalTable: false});
        let modalCloseCreateFav = () => this.setState({ showModalCreateFav: false});
        let modalCloseDeleteFav = () => this.setState({ showModalDeleteFav: false});
        let modalClose = () => this.setState({ showModal: false});
        let modalCloseKm = () => this.setState({ showModalKm: false});
        return (
            <div style={c.backColor} className="menuser">
            <Modal.Dialog  size='lg' centered>
            <Modal.Body style={c.grayRgb}>
                <CardDeck>
                    <Card style={c.grayRgb} >
                        <center>
                        <h2> <img alt='' src={car}/> Menu Usuario</h2> 
                        <h6> Datos: { this.state.name} <br></br> Telefono: {this.state.cellphone}</h6>
                        <ListGroup>
                        <ListGroupItem action style={{width:'50', height:'50', margin:'center'}} variant="light" onClick={this.gokmUsed} >Kilometros Recorridos</ListGroupItem>
                        <ListGroupItem action variant="light" onClick={this.goTable}>Historial</ListGroupItem>
                        <ListGroupItem action variant="light" onClick={this.goChangeUser}>Modificar Información</ListGroupItem>
                        <ListGroupItem action variant="light" onClick={this.getService} >¡Solicitar Servicio!</ListGroupItem>
                        <ListGroupItem action variant="light" onClick={this.pay} >Pagar deudas</ListGroupItem>
                        <ListGroupItem action variant="light" onClick={this.addFav}> Agregar Lugar Favorito</ListGroupItem>
                        <ListGroupItem action variant="light" onClick={this.deleteFav}>Eliminar Lugar Favorito</ListGroupItem>
                        <ListGroupItem action href='/' variant="danger">Cerrar Sesión</ListGroupItem>
                        </ListGroup>
                        <Button style = {{ margin: 5}} onClick={this.showMap} variant="success" className="float-right">Ver Mapa</Button>
                        </center>
                    </Card>
                    { this.state.showMap === true ? <Card style={c.grayRgb}> 
                    <LMap height={'600px'} width={'100%'} markers={this.state.markers.coordinates} origin={this.state.origin} point = { value => this.callbackMap(value)} modoobtener={'false'}  linea={'false'}/> </Card> : <div></div>}
                </CardDeck>
            </Modal.Body>
            </Modal.Dialog>
            <CreateFav show={this.state.showModalCreateFav} onHide={modalCloseCreateFav} cellphone={this.state.cellphone}/>
            <History show={this.state.showModalTable} onHide={modalCloseTable} type={'cellphoneclient'} cellphone={this.state.cellphone}/>
            <KmUsed show={this.state.showModalKm} cellphonetype={'cellphoneclient'} cellphone={this.state.cellphone} onHide={modalCloseKm}/>
            <Service show={this.state.showModal} cellphone={this.state.cellphone} firstpoint={this.state.origin} favcoordinates={this.state.markers.coordinates} onHide={modalClose}/>
            <DeleteFav show={this.state.showModalDeleteFav} markers={this.state.markers.coordinates}  cellphone={this.state.cellphone} onHide={modalCloseDeleteFav}/>
        </div>
        );
    }
}


export default withRouter(Menuser);
