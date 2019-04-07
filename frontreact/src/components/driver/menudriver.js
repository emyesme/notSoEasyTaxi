import React, { Component } from 'react';
import LMap from '../map';
import car from '../images/logo.png';
import { Button, Modal,ButtonGroup, DropdownButton,Dropdown, CardDeck, Card} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import axios from 'axios';

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
            showMap: false,
            point : {
                lat: 1.0,
                lng: 1.0,
            }
        }
        this.showMap = this.showMap.bind(this)
        this.goUpdateTaxi = this.goUpdateTaxi.bind(this)
        this.goChangeTaxi = this.goChangeTaxi.bind(this)
    }
    componentWillMount(){
        axios.get(api+"/Conductor?cellphone="+this.props.location.state.cellphone)
        .then( response => {
            if( response.data.error != null){
                alert(response.data.error);
              }
              else{
                this.setState({ name: response.data.name, plaque: response.data.plaque})
              }
        }).catch(error => alert(error))
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
    goChangeTaxi (){
        this.props.history.push({
            pathname: "/Taxi",
            state: { cellphone: this.state.cellphone,plaque: '', enable: true}
        })
    }
    goUpdateTaxi(){
        this.props.history.push({
            pathname: "/Taxi",
            state: { cellphone: this.state.cellphone,plaque:this.state.plaque, enable: false}

        })
    }
    render() {
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
                        <Button style={pad}>Eliminar Taxi</Button>
                        <Button style={pad}>Eliminar Cuenta</Button>
                        <Button style={pad}>Kilometros Recorridos</Button>
                        <Button style={pad}>Historial</Button>
                        <Button style={pad}>Estado: Libre</Button>
                        <Button style={pad}>¡Hay un Servicio!</Button>
                        <DropdownButton  style={pad} as={ButtonGroup} title="Dropdown" id="bg-vertical-dropdown-3">
                            <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
                            <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
                        </DropdownButton>
                        <Button style = {{    margin: 5, align: 'center'}} href='/' variant="danger">Cerrar Sección</Button>
                        </ButtonGroup>
                        <p>latitud: {this.state.point.lat}, longitud: {this.state.point.lng}</p>
                        </div>
                        <Button style = {{ margin: 5}} onClick={this.showMap} variant="success" className="float-right">Ver Mapa</Button>
                        </center>
                    </Card>
                    { this.state.showMap === true ? <Card style={grayRgb}> 
                    <LMap  height={'695px'} width={'100%'} markers={[]}  origin={{lat:0,lng:0}} point = { value => this.callback(value)} modoObtener={false}/> </Card> : <div></div>}
                </CardDeck>
            </Modal.Body>
            </Modal.Dialog>
        </div>
        );
    }
}




export default withRouter(Menudriver);