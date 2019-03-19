import React, {Component}  from 'react';
import user from './images/user.png'
import {Modal,Button,Form } from 'react-bootstrap'
import axios from 'axios'
import {withRouter} from 'react-router-dom'

const backdropStyle = {
    backgroundColor: '#808080',
  };

class RegisterUser extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
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
            <Form onSubmit={this.signIn}>
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
                    <Form.Control type="text" placeholder="coordenada x" name="gx" onChange={this.handleChange}/>
                    <Form.Control type="text" placeholder="coordenada y" name="gy" onChange={this.handleChange}/>
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