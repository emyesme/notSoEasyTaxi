import React, {Component}  from 'react';
import {Modal,Button,Form, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import {withRouter} from 'react-router-dom';

const c = require('../constants')

class CreateModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model: '',
            trademark: '',
            trunk: '',
            show: true
        }
        this.createModel = this.createModel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.goSetTrunk = this.goSetTrunk.bind(this);
        this.enableB = this.enableB.bind(this);
    }
    
    createModel(e){
        e.preventDefault();
        if (this.state.model === '' || this.state.trademark === '' || this.state.trunk === ''){
            alert("Alguno de los campos esta vacio")
        }
        else{
            axios.post(c.api + '/CrearModelo',{
                model: this.state.model,
                trademark: this.state.trademark,
                trunk: this.state.trunk
            }).then( response => {
                if(response.data.error != null){
                    alert(response.data.error)
                }
                else{
                    this.setState({model: '', trademark: '', trunk: '', show: true})
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
    enableB(){
        this.setState({show: false})
    }
    goSetTrunk(data){
        console.log(data)
        this.setState({trunk: data})
        this.enableB()
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
                            <Form.Control type="text" placeholder="Ingrese el modelo" name="model" value={this.state.model} onChange={this.handleChange}/>
                        </Form.Group>

                        <Form.Group controlId="IngresoMarca">
                            <Form.Label>Marca</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese la marca" name="trademark" value={this.state.trademark} onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="IngresoBaul">
                            <Form.Label>Baul</Form.Label>
                            <Dropdown>
                                <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                                    Baules
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => this.goSetTrunk('Pequeno')}>Pequeño</Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.goSetTrunk('Mediano')}>Mediano</Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.goSetTrunk('Grande')}>Grande</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>
                        <Button disabled={this.state.show} variant="primary" type="submit">
                            Crear
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
 
export default withRouter(CreateModel);