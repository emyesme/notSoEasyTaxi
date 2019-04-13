import React, { Component } from 'react';
import {Modal} from 'react-bootstrap';
import Axios from 'axios';
import {withRouter} from 'react-router-dom';
import waiting from '../images/waiting.gif';
import check from '../images/checked.png';
import error from '../images/error.png';
import car from '../images/logo.png';

const c = require('../constants')

class startService extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            idInterval: 0,
            idAsk: this.props.location.state.idAsk,
            cellphonedriver: this.props.location.state.cellphonedriver,
            plaque: '',
            stateAsk: 'no',
            driver: false,
            show: false,
            mensaje: 'Viajando.....'
        }
        console.log(this.state.cellphonedriver)
        /*this.bringDriverId = this.bringDriverId.bind(this);*/
        this.verifyAvaliable = this.verifyAvaliable.bind(this);
        this.verifyAskAll = this.verifyAskAll.bind(this);
        this.verifyAsk = this.verifyAsk.bind(this);
        this.endTravel = this.endTravel.bind(this);
    }
    componentWillMount(){
        this.verifyAvaliable()
        this.verifyAsk()
        this.setState({ idInterval : setInterval(this.verifyAskAll,3000)})//cada 10 segundos
    }
    async verifyAskAll(){
        try{
            await this.verifyAvaliable()
            await this.verifyAsk()
            /*ahora aqui iria cuando cambie a acepto o cuando cancele */
            if ( this.state.driver === "Fue aceptada"){
                this.setState({ show: true })
                this.endTravel()
            }
        }catch(error){
            console.log(error)
        }
    }
    endTravel(){
        clearInterval(this.state.idInterval)
        Axios.post(c.api+'/FinServicio',
        {
            idAsk: this.state.idAsk
        }).then( response => {
            if(response.data.error != null){
                alert(response.data.error)
            }
            else{
                if ( this.state.idAsk === response.data.idask){
                    this.setState({ mensaje: 'Viaje finalizado pasar a la etapa de Calificacion...'})
                    this.props.history.push({ pathname: '/Calificar', state: { idAsk: this.state.idAsk}})
                }
            }             
        }).catch( error => console.log(error))
    }
    verifyAvaliable(){
        Axios.get(c.api+'/DisponibilidadConductor?cellphone='+this.state.cellphonedriver)
        .then( response => {
            if(response.data.error != null){
                alert(response.data.error)
            }
            else{
                this.setState({ stateAsk: "available"})
            } 
        }).catch( error => console.log(error))
    }
    verifyAsk(){
        Axios.get(c.api+'/ServicioAceptado?idAsk='+this.state.idAsk)
        .then( response => {
            if(response.data.error != null){
                alert(response.data.error)
            }
            else{
                this.setState({ driver: response.data.mensaje})
            }             
        })
    }
    render() { 
        return ( 
            <div style={c.backColor}>
                <Modal.Dialog
                    size="xs"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>
                    <Modal.Header>
                    <Modal.Title>
                    <img alt='' src={car} height='48px' width='48px'/>   Conductor Encontrado
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <center><img alt='loading...' src={waiting} height='240px' width='240px'/></center>
                        <p>Esperando...</p>
                        {/*<p> idAsk:  {this.state.idAsk}</p>*/}
                        <p> Telefono: {this.state.cellphonedriver} </p>
                       {/*<p> verifyAvaliable: {this.state.stateAsk} </p>*/}
                        <p> Estado de la solicitud: { this.state.driver !== "Aceptada" ? <img style={{margin:5}} alt='' src={error} height={'30'} width={'30'}/> : <img style={{margin:5}} alt='' src={check} height={'30'} width={'30'}/>} </p>
                    </Modal.Body>
                    {/*<Modal.Footer ><Button href="/" variant='danger'>Solo programadores</Button></Modal.Footer>*/}
                </Modal.Dialog>
                <Modal show={this.state.show} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Body>
                <center><h2>{this.state.mensaje} </h2></center>
                </Modal.Body>
            </Modal>
            </div>
        );
    }
}
 
export default withRouter(startService);