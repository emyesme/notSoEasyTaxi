import React, { Component } from 'react';
import {Modal,Button} from 'react-bootstrap'
import Axios from 'axios';
import {withRouter} from 'react-router-dom';

const backColor = {
    backgroundColor: '#731E6F',
};

const api = "http://localhost:4000";

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
        this.setState({ idInterval : setInterval(this.verifyAskAll,5000)})//cada 10 segundos
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
        console.log("deberia detenerse")
        Axios.post(api+'/FinServicio',
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
        Axios.get(api+'/DisponibilidadConductor?cellphone='+this.state.cellphonedriver)
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
        Axios.get(api+'/ServicioAceptado?idAsk='+this.state.idAsk)
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
            <div style={backColor}>
                <Modal.Dialog
                    size="xs"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>
                    <Modal.Header>
                    <Modal.Title>
                        Conductor Encontrado
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Esperando que el conductor acepte....
                        <p> idAsk:  {this.state.idAsk}</p>
                        <p> cellphone: {this.state.cellphonedriver} </p>
                        <p> verifyAvaliable: {this.state.stateAsk} </p>
                        <p> conductor?: {this.state.driver} </p>
                    </Modal.Body>
                    <Modal.Footer ><Button href="/" variant='danger'>Solo programadores</Button></Modal.Footer>
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