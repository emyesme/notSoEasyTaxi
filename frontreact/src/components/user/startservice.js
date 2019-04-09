import React, { Component } from 'react';
import {Modal,Button,Image} from 'react-bootstrap'
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
            idAsk: this.props.location.state.idAsk,
            cellphonedriver: this.props.location.state.cellphonedriver,
            plaque: '',
            stateAsk: 'no',
            count: 0,
            driver: false
        }
        /*this.bringDriverId = this.bringDriverId.bind(this);*/
        this.verifyAvaliable = this.verifyAvaliable.bind(this);
        this.verifyAsk = this.verifyAsk.bind(this);
    }
    componentWillMount(){
        this.verifyAvaliable()
        this.verifyAsk()
        setInterval(this.verifyAsk,5000)//cada 10 segundos
    }
    async verifyAsk(){
        try{
            await this.verifyAvaliable()
            await this.verifyAsk()
            /*ahora aqui iria cuando cambie a acepto o cuando cancele */
            await this.setState({ count : this.state.count += 1})
        }catch(error){
            console.log(error)
        }
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
                    <Modal.Title id="contained-modal-title-vcenter">
                        Conductor Encontrado
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Esperando que el conductor acepte....
                        <p> idAsk:  {this.state.idAsk}</p>
                        <p> cellphone: {this.state.cellphonedriver} </p>
                        <p> verifyAvaliable: {this.state.stateAsk} </p>
                        <p> conductor?: {this.state.driver} </p>
                        <p> count: {this.state.count} </p>
                    </Modal.Body>
                    <Modal.Footer ><Button href="/" variant='danger'>Solo programadores</Button></Modal.Footer>
                </Modal.Dialog>
            </div>
        );
    }
}
 
export default withRouter(startService);