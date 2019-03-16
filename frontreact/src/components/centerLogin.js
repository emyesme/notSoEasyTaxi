import React from 'react';
import car from './car-insurance.png'
import {Modal,Button,Form } from 'react-bootstrap'

const backdropStyle = {
  backgroundColor: '#808080',
};


class CenterLogin extends React.Component {
    render() {
      return (
        <div style={backdropStyle}>
        <Modal.Dialog
          //{...this.props}
          size="xs"
          aria-labelledby="contained-modal-title-vcenter"
          centered>
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              <center><img alt='' src={car}/>   Ingresa tus Datos</center>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
            <Form.Group controlId="IngresoUsuario">
                <Form.Label>Nombre de usuario</Form.Label>
                <Form.Control type="usuario" placeholder="Ingrese su usuario" />
            </Form.Group>

            <Form.Group controlId="IngresoContrasenia">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" placeholder="contraseña" />
            </Form.Group>
              <Button href="/menuser" variant="primary" type="submit">
                  Ingreso Usuario
              </Button>
            <br></br>
            <Button href='/menudriver' variant="secondary" type="submit">
                Ingreso Conductor
            </Button>
            </Form>
          </Modal.Body>
        </Modal.Dialog>
        </div>
      );
    }
  }

export default CenterLogin;
