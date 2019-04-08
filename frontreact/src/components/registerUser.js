import React, {Component}  from 'react';
import user from './images/user.png'
import {Modal,Button,Form } from 'react-bootstrap'
import {withRouter} from 'react-router-dom'
import axios from 'axios';
import ModalMap from '../components/modalmap';
import check from './images/checked.png';
import error from './images/error.png';

const backdropStyle = {
    backgroundColor: 'rgb(93, 110, 128)',
};

const api = "http://localhost:4000";

class RegisterUser extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            type: this.props.location.state.type,
            name: '',
            cellphone: '0000000000',
            pass: '',
            address: '',
            creditCard: '',
            showModal: false,
            point:{
                lat: 1,
                lng: 1
            }
        }
        this.createUser = this.createUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getMap = this.getMap.bind(this);
    }
    createUser(e){
        e.preventDefault()
        //una muy linda verificacion que no estoy haciendo sobre tipos de datos y demas
        if ( this.state.name === "" || this.state.cellphone === ""|| this.state.pass === ""|| this.state.point.lat === 1 || this.state.creditCard === ""){
            alert("Alguno de los campos esta vacio")
        }
        else{
            axios.post(api + '/RegistrarUsuario',{
                cellphone: this.state.cellphone,
                pass: this.state.pass,
                name: this.state.name,
                address: this.state.point,
                creditCard: this.state.creditCard
            }).then( response => {
                console.log("info enviada")
                if(response.data.error != null){
                    alert(response.data.error)
                }
                else{
                    alert(response.data.mensaje)
                    this.props.history.push(
                        {pathname: "/login",
                        state: { type: this.state.type}})
                }
            }).catch( error => console.log(error))
        }   
    }
    getMap(){
        this.setState( { showModal: !this.state.showModal})
    }
    handleChange(e){
        const { name, value} = e.target;
        this.setState({
            [name]: value
        })
    }
    callback (inputPoint){
        this.setState({
            point:{ lat: inputPoint.lat, lng: inputPoint.lng},
            showModal: false
        })
    }
    render() {
        let modalClose = () => this.setState({ showModal: false });
        return (
        <div style={backdropStyle}>
            <Modal.Dialog size="md" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    <center><img alt='' src={user}/>  Registra tu información </center>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.createUser}>
                        <Form.Group controlId="IngresoNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese su nombre" name="name" onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="IngresoCelular">
                            <Form.Label>Celular</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese su celular" name="cellphone" onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="IngresoContrasenia">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" placeholder="contraseña" name="pass" onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="IngresoDireccion">
                            <Form.Label style={{margin: 5}}>Dirección </Form.Label>
                            <Button style={{margin: 5}} onClick={this.getMap} variant="secondary">Seleccionar</Button>
                            { this.state.point.lat === 1 ? <img style={{margin:5}} alt='' src={error} height={'30'} width={'30'}/> : <img style={{margin:5}} alt='' src={check} height={'30'} width={'30'}/>}
                        </Form.Group>
                        <Form.Group controlId="IngresoTarjetaCredito">
                            <Form.Label>Tarjeta de Credito</Form.Label>
                            <Form.Control type="text" placeholder="Numero de tarjeta" name="creditCard" onChange={this.handleChange}/>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Ingresar
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button href='/' variant='danger'> Cancelar </Button>
                </Modal.Footer>
            </Modal.Dialog>
            {/*Mostrar mapa para seleccionar punto*/}
            <ModalMap show={this.state.showModal} onHide={modalClose} firstpoint={{lat:-1,lng:-1}} coordinates = { value => this.callback(value)} modoObtener={false}/>
        </div>
        );
    }
}
 
export default withRouter(RegisterUser);