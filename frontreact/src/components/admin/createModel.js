import React, {Component}  from 'react';
import {Modal,Button,Form } from 'react-bootstrap';
import axios from 'axios';

const backdropStyle = {
    backgroundColor: 'rgb(93, 110, 128)',
};

const api = "http://localhost:4000";

class CreateModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model: '',
            trademark: '',
            trunk: ''
        }
    }
    
    CreateModel(e){
        e.preventDefault()
        if (this.state.model === "" || this.state.trademark === "" || this.state.trunk){
            alert("Alguno de los campos esta vacio")
        }
        else{
            axios.post(api + '/CrearModelo',{
                model: this.state.model,
                trademark: this.state.trademark,
                trunk: this.state.trunk
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
        <div style={backdropStyle}>
            <Modal.Dialog size="md" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    <center>/>Eliminar modelo</center>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.createModel}>
                        <Form.Group controlId="IngresoModelo">
                            <Form.Label>Model</Form.Label>
                            <Form.Control type="text" placeholder="Modelo: " name="model" onChange={this.handleChange}/>
                        </Form.Group>

                        <Form.Group controlId="IngresoMarca">
                            <Form.Label>Model</Form.Label>
                            <Form.Control type="text" placeholder="Marca: " name="trademark" onChange={this.handleChange}/>
                        </Form.Group>

                        <Form.Group controlId="IngresoMarca">
                            <Form.Label>Model</Form.Label>
                            <Form.Control type="text" placeholder="Baúl: " name="trademark" onChange={this.handleChange}/>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Crear
                        </Button>

                    </Form>
                </Modal.Body>
                
            </Modal.Dialog>
            
        </div>
        );
    }
}
 
export default CreateModel;