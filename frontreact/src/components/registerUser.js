import React, {Component}  from 'react';
import user from './images/user.png'
import {Modal,Button,Form } from 'react-bootstrap'
import {withRouter} from 'react-router-dom'
import axios from 'axios';

const backdropStyle = {
    backgroundColor: '#808080',
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
            creditCard: ''
        }
        this.createUser = this.createUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    createUser(e){
        e.preventDefault()
        console.log("entro a createUser")
        //una muy linda verificacion que no estoy haciendo sobre tipos de datos y demas
        if ( this.state.name === "" || this.state.cellphone === ""|| this.state.pass === "" || this.state.address === "" || this.state.creditCard === ""){
            alert("Alguno de los campos esta vacio")
        }
        else{
            axios.post(api + '/RegistrarUsuario',{
                cellphone: this.state.cellphone,
                pass: this.state.pass,
                name: this.state.name,
                address: this.state.address,
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
    handleChange(e){
        const { name, value} = e.target;
        this.setState({
            [name]: value
        })
    }
    render() { 
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
                            <Form.Label>Dirección (En coordenadas)</Form.Label>
                            <Form.Control type="text" placeholder="coordenadas" name="address" onChange={this.handleChange}/>
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
        </div>
        );
    }
}
 
export default withRouter(RegisterUser);