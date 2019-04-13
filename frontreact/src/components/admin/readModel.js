import React, {Component}  from 'react';
import {Modal,Button,Form } from 'react-bootstrap';
import axios from 'axios';


const c = require('../constants')

class ReadModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model: ''
        }
    }
    
    ReadModel(e){
        e.preventDefault()
        if (this.state.model === ""){
            alert("El campo modelo esta vacio")
        }
        else{
            axios.post(c.api + '/ConsultarModelo',{
                model: this.state.model
            }).then( response => {
                console.log("info enviada")
                if(response.data.error != null){
                    alert(response.data.error)
                }
                else{
                    alert(response.data.data)
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
                    <Form onSubmit={this.createModel}>
                        <Form.Group controlId="IngresoModelo">
                            <Form.Label>Modelo</Form.Label>
                            <Form.Control type="text" placeholder="Ingresa modelo" name="model" onChange={this.handleChange}/>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Buscar
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
 
export default ReadModel;