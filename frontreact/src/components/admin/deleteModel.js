import React, {Component}  from 'react';
import {Modal,Button,Form } from 'react-bootstrap';
import axios from 'axios';


const c = require('../constants')

class DeleteModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model: ''
        }
        this.DeleteModel = this.DeleteModel.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    DeleteModel(e){
        e.preventDefault()
        if (this.state.model === ""){
            alert("El campo modelo esta vacio")
        }
        else{
            axios.post(c.api + '/EliminarModelo',{
                model: this.state.model
            }).then( response => {
                console.log("info enviada")
                if(response.data.error != null){
                    alert(response.data.error)
                }
                else{
                    alert(response.data.mensaje)
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
        <div style={c.backColor}>
            <Modal.Dialog>
                <Modal.Header>
                <Modal.Title>
                    <center>Crear modelo</center>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.DeleteModel}>
                        <Form.Group controlId="IngresoModelo">
                            <Form.Label>Model</Form.Label>
                            <Form.Control type="text" placeholder="Modelo: " name="model" onChange={this.handleChange}/>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Eliminar
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button href='/admin' variant='danger' className="float-right">Cancelar</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
        );
    }
}
 
export default DeleteModel;