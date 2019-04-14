import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Modal,Button, Form} from 'react-bootstrap';
import Axios from 'axios';

const c = require('../constants')

class deleteUser extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            cellphone: ''
        }
        this.deleteUser = this.deleteUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    deleteUser(e){
        e.preventDefault()
        if ( this.state.cellpone === ''){
            alert("Campo vacio ingrese el dato porfavor.")
            return
        }
        Axios.post(c.api+'/EliminarUsuario',
        {
            cellphone: this.state.cellphone
        }).then( response => {
            if(typeof response.data.error !== 'undefined'){
                alert(response.data.error)
            }else{
                alert(response.data.mensaje)
                this.props.onHide()
            }
        })
    }
    handleChange(e){
        const { name, value} = e.target;
        this.setState({
            [name]: value
        })
    }
    render() {
        return (
            <div>
            <Modal
            {...this.props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header>
              <Modal.Title id="contained-modal-title-vcenter">
                Eliminar Usuario
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form onSubmit={this.deleteUser}>
            <Form.Group controlId="Celular">
                <Form.Label>Celular</Form.Label>
                <Form.Control type="text" placeholder="Telefono del Usuario" name="cellphone" onChange={this.handleChange}/>
            </Form.Group>
            <Button style={c.pad} variant="success" type="submit">
                Eliminar
            </Button>
            </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={this.props.onHide}>Cerrar</Button>
            </Modal.Footer>
          </Modal>
          </div>
        );
    }
}
 
export default withRouter(deleteUser);