import React from 'react';
import car from './car-insurance.png'
import {Modal,Button,Form } from 'react-bootstrap'
import axios from 'axios'
import {withRouter} from 'react-router-dom'

const backdropStyle = {
  backgroundColor: '#808080',
};

const api = "http://localhost:4000";

class CenterLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cellphone: '',
      name: 'a',
      pass: ''};
      this.signIn = this.signIn.bind(this);
      this.handleChange = this.handleChange.bind(this);
  }
  signIn(e){
    axios.get(api + "/client?cellphone="+this.state.cellphone)
    .then(response => {
      if( response.data.error != null){
        alert("Usuario no encontrado");
      }
      else{
        //quizas innecesario set state
        this.setState({
          cellphone: response.data.cellphone,
          name: response.data.name
        })
        this.props.history.push(
          {pathname: '/menuser/',
          state: { name: this.state.name, cellphone: this.state.cellphone} })
      }
    })
    .catch( err => console.log(err))
    e.preventDefault();
    
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
          <Form onSubmit={this.signIn}>
          <Form.Group controlId="IngresoUsuario">
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control type="text" placeholder="Ingrese su usuario" name="cellphone" onChange={this.handleChange}/*value={this.state.cellphone}*//>
          </Form.Group>

          <Form.Group controlId="IngresoContrasenia">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" placeholder="contraseña" name="pass" onChange={this.handleChange}/*value={this.state.password}*//>
          </Form.Group>
            <Button /*href="/menuser"*/ variant="primary" type="submit">
                Ingreso Usuario
            </Button>
          <br></br>
          <Button /*href='/menudriver'*/ variant="secondary" type="submit">
              Ingreso Conductor
          </Button>
          </Form>
        </Modal.Body>
      </Modal.Dialog>
      </div>
    );
  }
}

export default withRouter(CenterLogin);
