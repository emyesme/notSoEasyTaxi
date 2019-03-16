import React from 'react';
import car from './car-insurance.png'
import {Modal,Button,Form } from 'react-bootstrap'
import { Link} from 'react-router-dom'

class CenterLogin extends React.Component {
    render() {
      return (
        <div>
        <Modal
          {...this.props}
          size="xs"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
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
                <Link to={"/Menuser"}>Ingreso Usuario</Link>
            <br></br>
            <Button variant="secondary" type="submit">
                Ingreso Conductor
            </Button>
            </Form>
            <Modal.Footer>
            <Button variant="danger" onClick={this.props.onHide}>Cerrar</Button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
        </div>
      );
    }
  }

export default CenterLogin;
