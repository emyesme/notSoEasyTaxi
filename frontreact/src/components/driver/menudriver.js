import React, { Component } from 'react';
import LMap from '../map';
import car from '../images/logo.png';
import { Button, Modal,ButtonGroup, CardDeck, Card, ListGroup} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import KmUsed from '../km'

const backColor = {
    backgroundColor: '#731E6F',
};

const pad = {
    margin: 5,
    align: 'center',
    backgroundColor: '#21387C',
    border:'#21387C',
    font: 'black',
    focused:{
        backgroundColor: '#808080'
    }
}

const grayRgb = {
    backgroundColor: 'rgb(148, 150, 172)',
}

const api = "http://localhost:4000";  

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
        }
        console.log(this.state.showTraveling)
        this.showMap = this.showMap.bind(this);
        this.goUpdateTaxi = this.goUpdateTaxi.bind(this);
        this.goChangeTaxi = this.goChangeTaxi.bind(this);
        this.declineService = this.declineService.bind(this);
        this.findService = this.findService.bind(this);
        this.gokmUsed = this.gokmUsed.bind(this);
        this.accept = this.accept.bind(this);
        this.end = this.end.bind(this);
        this.getGps = this.getGps.bind(this);
    }
    async findService(){
        await axios.get(api+'/HayServicio?cellphone='+this.state.cellphone)
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
        console.log(this.state.showTraveling)
        if ( this.state.showTraveling === true){
            await axios.post(api + '/MoverConductor',
            {
                cellphonedriver: this.state.cellphone,
                destiny: this.state.service.finalpoint
            }).then( response => {
                console.log(typeof response.data.error !== 'undefined')
                if(typeof response.data.error !== 'undefined'){
                    alert(response.data.error+ "jum")
                }
                else{
                    console.log(this.state.service.finalpoint)
                    const destinationOut = [ response.data.destiny.x, response.data.destiny.y]
                    console.log(destinationOut)
                    console.log(this.state.service.finalpoint[0] === destinationOut[0] && this.state.service.finalpoint[1] === destinationOut[1])
                    if (this.state.service.finalpoint[0] === destinationOut[0]){
                        this.setState({ showButtonCloseTraveling: true, mensaje: "Viaje Terminado Correctamente"})
                    }
                }
            })            
        }
    }
    componentWillMount(){
        axios.get(api+"/Conductor?cellphone="+this.state.cellphone)
        .then( response => {
            if( response.data.error != null){
                alert(response.data.error);
            }
            else{
              this.setState({ name: response.data.name, plaque: response.data.plaque})
              this.getGps()
            }
        }).catch(error => alert(error))
        setInterval(this.findService, 3000)
    }
    getGps(){
        console.log(this.state.plaque)
        axios.get(api+"/Posicion?plaque="+this.state.plaque)
        .then(response => {
            if( response.data.error != null){
                alert(response.data.error);
            }
            else{
                console.log(response.data)
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
        console.log(this.state.gps)
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
    gokmUsed(){
        this.setState({ showModal: !this.showModal})
    }
    accept(){
        axios.post(api+'/AceptaConductor',
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
    }
    render() {
        let modalClose = () => this.setState({ showModal: false});
        return (  
        <div style={backColor}>
            <Modal.Dialog  size='lg' centered>
            <Modal.Body style={grayRgb}>
                <CardDeck>
                    <Card style={grayRgb} >
                        <center>
                        <h2> <img alt='' src={car}/> Menu Conductor</h2> 
                        <h6> Telefono: {this.state.cellphone} Placa: {this.state.plaque} </h6>
                        <div>
                        <ButtonGroup vertical>
                        <Button style={pad} >Modificar Información Personal</Button>
                        <Button style={pad} onClick={this.goUpdateTaxi}>Modificar Información del Taxi</Button>
                        <Button style={pad} onClick={this.goChangeTaxi}>Cambiar de Taxi</Button>
                        <Button style={pad} onClick={this.gokmUsed} >Kilometros Recorridos</Button>
                        <Button style={pad}>Historial</Button>
                        <Button style={pad}>Estado: Libre</Button>
                        <Button style = {{    margin: 5, align: 'center'}} href='/' variant="danger">Cerrar Sección</Button>
                        </ButtonGroup>
                        <p>latitud: {this.state.point.lat}, longitud: {this.state.point.lng}</p>
                        </div>
                        <Button style = {{ margin: 5}} onClick={this.showMap} variant="success" className="float-right">Ver Mapa</Button>
                        </center>
                    </Card>
                    { this.state.showMap === true ? <Card style={grayRgb}> 
                    {console.log(this.state.gps)}
                    <LMap  height={'695px'} width={'100%'} markers={[]}  origin={this.state.gps} point = { value => this.callback(value)} modoObtener={false}/> </Card> : <div></div>}
                </CardDeck>
            </Modal.Body>
            </Modal.Dialog>
            <Modal show={this.state.show} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Body>
                <h6>Servicio para tu Taxi!! </h6>
                <ListGroup>
                            <ListGroup.Item>
                                idAsk: {this.state.service.idAsk}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                CellphoneClient: {this.state.service.cellphoneclient}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Inicio: [{this.state.service.initialpoint[0]},{this.state.service.initialpoint[1]}]
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Final: [{this.state.service.finalpoint[0]},{this.state.service.finalpoint[1]}]
                            </ListGroup.Item>
                        </ListGroup>                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='success' onClick={this.accept}>Si!</Button>
                    <Button variant='danger' onClick={this.declineService}>Cancelar</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={this.state.showTraveling} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Body>
                <center><h2>{this.state.mensaje} </h2></center>
                </Modal.Body>
                <Modal.Footer>
                    { this.state.showButtonCloseTraveling === false ? <div></div> :  <Button variant='danger' onClick={this.end}>Terminar</Button>}
                </Modal.Footer>
            </Modal>
           <KmUsed show={this.state.showModal} cellphonetype={'cellphonedriver'} cellphone={this.state.cellphone} onHide={modalClose}/>
        </div>
        );
    }
}




export default withRouter(Menudriver);