import React, {Component}  from 'react';
import {Modal,Button,Form, ListGroup } from 'react-bootstrap';
import axios from 'axios';


const c = require('../constants')

class ReadModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model: '',
            trademark: '',
            trunk: '',
            showinfo: false
        }
        this.readModel = this.readModel.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    readModel(e){
        e.preventDefault()
        if (this.state.model === ""){
            alert("El campo modelo esta vacio")
        }
        else{
            axios.get(c.api + '/ConsultarModelo?model='+this.state.model,
            {
                model: this.state.model
            }).then( response => {
                if(response.data.error != null){
                    alert(response.data.error)
                }
                else{
                    this.setState({showinfo: true, model: response.data[0].model, trademark: response.data[0].trademark, trunk: response.data[0].trunk})
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
                    <center>Ver modelo</center>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.readModel}>
                        <Form.Group controlId="IngresoModelo">
                            <Form.Label>Modelo</Form.Label>
                            <Form.Control type="text" placeholder="Ingresa modelo" name="model" onChange={this.handleChange}/>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Buscar
                        </Button>
                    </Form>
                
                </Modal.Body>
                {this.state.showinfo ?
                <ListGroup>
                <ListGroup.Item>Modelo: {this.state.model}</ListGroup.Item>
                <ListGroup.Item>Marca: {this.state.trademark}</ListGroup.Item>
                <ListGroup.Item>Baul: {this.state.trunk}</ListGroup.Item>
                </ListGroup>: <div></div>}
                <Modal.Footer>
                    <Button href='/admin' variant='danger' className="float-right">Cancelar</Button>
                </Modal.Footer>
            </Modal.Dialog>
            
        </div>
        );
    }
}
 
export default ReadModel;