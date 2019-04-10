import React from 'react';
import car from '../images/logo.png';
import {Modal,Button,Form } from 'react-bootstrap';
import axios from 'axios';
import {withRouter} from 'react-router-dom';

const backdropStyle = {
  backgroundColor: 'rgb(148, 150, 172)',
};

const pad = {
  margin: 5,
  align: 'center'
}

const api = "http://localhost:4000";

class CenterLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.location.state.type,
      cellphone: '',
      name: '',
      pass: ''
    };
    this.signIn = this.signIn.bind(this);
    this.register = this.register.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  signIn(e){
    //encriptar el pass falta
    e.preventDefault()
    if((this.state.type !== "Usuario") && (this.state.type !== "Conductor")){
      alert("Tipo de usuario invalido")
    }
    axios.get(api + "/Ingresar"+this.state.type+"?cellphone="+this.state.cellphone+"&pass="+this.state.pass)
    .then(response => {
      if( response.data.error != null){
        alert(response.data.error);
      }
      else{
        this.props.history.push(
          {pathname: "/"+this.state.type,
          state: { cellphone: response.data.cellphone} })
      }
    })
    .catch( err => console.log(err))
  }
  register(){
    this.props.history.push(
      { pathname: "/Registrar",
    state: { type: this.state.type}}
    )
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
      <Modal.Dialog
        size="xs"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            <center><img alt='' src={car}/>   Ingresa tus Datos</center>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.signIn}>
          <Form.Group controlId="IngresoUsuario">
              <Form.Label>Celular del {this.state.type}</Form.Label>
              <Form.Control type="text" placeholder="Ingrese su celular" name="cellphone" onChange={this.handleChange}/>
          </Form.Group>
          <Form.Group controlId="IngresoContrasenia">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" placeholder="Ingrese su contraseña" name="pass" onChange={this.handleChange}/>
          </Form.Group>
            <Button style={pad} variant="primary" type="submit">
                Ingreso {this.state.type}
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <p style={{color: 'gray'}}>No tienes cuenta? Registrate como:</p>
          <Button onClick={this.register} variant="outline-secondary">
            {this.state.type}
          </Button>
          <Button href='/' variant='danger'> Atras </Button>
        </Modal.Footer>
      </Modal.Dialog>
      </div>
    );
  }
}

export default withRouter(CenterLogin);
