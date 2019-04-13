import React, { Component } from 'react';
import LMap from '../map';
import car from '../images/logo.png';
import { Button, Modal,ListGroupItem, CardDeck, Card, ListGroup} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import KmUsed from '../km';
import History from '../historial';


const c = require('../constants')
class Menudriver extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            cellphone: this.props.location.state.cellphone,
            plaque: '',
            gps: {
                lat: -1,
                lng: -1
            },
            showMap: false,
            point : {
                lat: 1.0,
                lng: 1.0,
            },
            service: {
                idAsk: 0,
                cellphoneclient: '0000000000',
                initialpoint: [],
                finalpoint: []
            },
            mensaje : "Viajando...",
            showTraveling: false,
            showButtonCloseTraveling: false,
            show: false,
            showModal: false,
            showModalTable: false,
            disponible:  "Libre"
        }
        this.showMap = this.showMap.bind(this);
        this.goUpdateTaxi = this.goUpdateTaxi.bind(this);
        this.goChangeTaxi = this.goChangeTaxi.bind(this);
        this.declineService = this.declineService.bind(this);
        this.findService = this.findService.bind(this);
        this.gokmUsed = this.gokmUsed.bind(this);
        this.accept = this.accept.bind(this);
        this.end = this.end.bind(this);
        this.getGps = this.getGps.bind(this);
        this.goTable = this.goTable.bind(this);
        this.changeAvaliable = this.changeAvaliable.bind(this);
    }
    async findService(){
        await axios.get(c.api+'/HayServicio?cellphone='+this.state.cellphone)
        .then( response => {
            if( response.data.mensaje !== "Noy hay servicios"){
                this.setState({ show: true, 
                    service: {
                        idAsk: response.data.servicio.idask, 
                        cellphoneclient: response.data.servicio.cellphoneclient,
                        initialpoint: [response.data.servicio.initialpoint.x, response.data.servicio.initialpoint.y],
                        finalpoint: [response.data.servicio.finalpoint.x, response.data.servicio.finalpoint.y],}})
            }
            else{
                console.log("no servicio")
            }
        })
        if ( this.state.showTraveling === true){
            await axios.post(c.api + '/MoverConductor',
            {
                cellphonedriver: this.state.cellphone,
                destiny: this.state.service.finalpoint
            }).then( response => {
                if(typeof response.data.error !== 'undefined'){
                    alert(response.data.error)
                }
                else{
                    const destinationOut = [ response.data.destiny.x, response.data.destiny.y]
                    if (this.state.service.finalpoint[0] === destinationOut[0]){
                        this.setState({ showButtonCloseTraveling: true, mensaje: "Viaje Terminado Correctamente"})
                    }
                }
            })            
        }
    }
    componentWillMount(){
        axios.get(c.api+"/Conductor?cellphone="+this.state.cellphone)
        .then( response => {
            if( response.data.error != null){
                alert(response.data.error);
            }
            else{
                if( response.data.plaque === null){
                    this.setState({ name: response.data.name, plaque: 'No tiene taxi'})
                }
                else{
                    if (response.data.available){
                        this.setState({ disponible: 'Libre'})
                    }else{
                        this.setState({ disponible: 'Ocupado'})
                    }
                    this.setState({ name: response.data.name, plaque: response.data.plaque})
                    this.getGps()
                }
                
            }
        }).catch(error => alert(error))
        setInterval(this.findService, 3000)
    }
    getGps(){
        if(this.state.plaque ===  'No tiene taxi' ){
            alert("No tiene taxi asignado")
            return 
        }
        axios.get(c.api+"/Posicion?plaque="+this.state.plaque)
        .then(response => {
            if( response.data.error != null){
                alert(response.data.error);
            }
            else{
                this.setState({gps: { lat: response.data.point.x, lng: response.data.point.y}})
            }            
        })
    }
    showMap(){
        this.setState({showMap: !this.state.showMap})
    }
    callback (inputPoint){
        this.setState({point:{ lat: inputPoint.lat, lng: inputPoint.lng}})
    }
    goChangeTaxi (){
        this.props.history.push({
            pathname: "/Taxi",
            state: { cellphone: this.state.cellphone,plaque: '', enable: true, point: this.state.gps}
        })
    }
    goUpdateTaxi(){
        this.props.history.push({
            pathname: "/Taxi",
            state: { cellphone: this.state.cellphone,plaque:this.state.plaque, enable: false, point: this.state.gps}
        })
    }
    declineService(){
        this.setState({ show: !this.state.show})
    }
    changeAvaliable(){
        axios.post(c.api+'/cambiarDisponibilidad',
        {
            cellphone: this.state.cellphone
        }).then( response => {
            if( response.data.error != null){
                alert(response.data.error);
            }
            else{
                if ( response.data.available){
                    this.setState({ disponible: "Libre"})
                }else{
                    this.setState({ disponible: "Ocupado"})
                }
            }            
        })
    }
    gokmUsed(){
        this.setState({ showModal: !this.showModal})
    }
    goTable(){
        this.setState({ showModalTable: !this.showModalTable})
    }
    accept(){
        axios.post(c.api+'/AceptaConductor',
        {
            idAsk: this.state.service.idAsk
        }
        ).then( response => {
            if( response.data.error != null){
                alert(response.data.error);
            }
            else{
                if ( response.data.idAsk === this.state.service.idAsk){
                    this.setState({ show: !this.state.show, showTraveling : true})
                }
            }            
        })
    }
    end(){
        this.setState({ showTraveling: false})
        this.getGps()
    }
    render() {
        let modalClose = () => this.setState({ showModal: false});
        let modalCloseTable = () => this.setState({ showModalTable: false});
        return (  
        <div style={c.backColor}>
        {/*Menu */}
            <Modal.Dialog  size='lg' centered>
            <Modal.Body style={c.grayRgb}>
                <CardDeck>
                    <Card style={c.grayRgb}>
                        <center>
                        <h2> <img alt='' src={car}/> Menu Conductor</h2> 
                        <h6> Nombre: {this.state.name}<br></br>Telefono: {this.state.cellphone} Placa: {this.state.plaque} </h6>
                        <ListGroup>
                        <center>
                        <ListGroupItem action variant={'light'}>Modificar Información Personal</ListGroupItem>
                        <ListGroupItem action onClick={this.goUpdateTaxi} variant={'light'}>Modificar Información del Taxi</ListGroupItem>
                        <ListGroupItem action onClick={this.goChangeTaxi} variant={'light'}>Cambiar de Taxi</ListGroupItem>
                        <ListGroupItem action onClick={this.gokmUsed} variant={'light'} >Kilometros Recorridos</ListGroupItem>
                        <ListGroupItem action onClick={this.goTable} variant={'light'}>Historial</ListGroupItem>
                        <ListGroupItem action onClick={this.changeAvaliable} variant={'light'}>Estado: {this.state.disponible}</ListGroupItem>
                        <ListGroupItem action href='/' variant={"danger"}>Cerrar Sección</ListGroupItem>
                        </center>
                        </ListGroup>
                        <Button style = {{ margin: 5}} onClick={this.showMap} variant="success" className="float-right">Ver Mapa</Button>
                        </center>
                    </Card>
                    { this.state.showMap === true ? <Card style={c.grayRgb}> 
                    <LMap  height={'625px'} width={'100%'} markers={[]}  origin={this.state.gps} point = { value => this.callback(value)} modoObtener={'false'} linea={'false'}/> </Card> : <div></div>}
                </CardDeck>
            </Modal.Body>
            </Modal.Dialog>
            {/*Menu de servicio */}
            <Modal show={this.state.show} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header>
                    <Modal.Title>
                        <h5><img alt='' height='48px' width='48px' src={car}/> Servicio para tu Taxi!!</h5>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <p>Id Servicio: {this.state.service.idAsk} </p>
                <p>Telefono Usuario:    {this.state.service.cellphoneclient}</p>
                <LMap  height={'300px'} width={'100%'} markers={[{point: {x:this.state.service.initialpoint[0] ,y:this.state.service.initialpoint[1]}}]} origin={{lat:this.state.service.finalpoint[0] ,lng:this.state.service.finalpoint[1]}} point = { value => this.callback(value)} modoObtener={'false'} linea={'true'}/>                   
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='success' onClick={this.accept}>Si!</Button>
                </Modal.Footer>
            </Modal>
            {/*Termino servicio */}
            <Modal show={this.state.showTraveling} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Body>
                <center><h2>{this.state.mensaje} </h2></center>
                </Modal.Body>
                <Modal.Footer>
                    { this.state.showButtonCloseTraveling === false ? <div></div> :  <Button variant='danger' onClick={this.end}>Terminar</Button>}
                </Modal.Footer>
            </Modal>
           <KmUsed show={this.state.showModal} cellphonetype={'cellphonedriver'} cellphone={this.state.cellphone} onHide={modalClose}/>
           <History show={this.state.showModalTable} onHide={modalCloseTable} type={'cellphonedriver'} cellphone={this.state.cellphone}/>
        </div>
        );
    }
}




export default withRouter(Menudriver);