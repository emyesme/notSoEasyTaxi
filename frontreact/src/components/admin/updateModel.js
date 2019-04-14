import React, {Component}  from 'react';
import {Modal,Button,Form, Dropdown} from 'react-bootstrap';
import axios from 'axios';
import DropdownItem from 'react-bootstrap/DropdownItem';

const c = require('../constants')
class UpdateModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model: '',
            trademark: '',
            trunk: '',
            models: []
        }
        this.UpdateModel = this.UpdateModel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getDataModel = this.getDataModel.bind(this);
    }
    componentWillMount(){
        axios.get(c.api+'/Modelos')
        .then( response => {
            if( response.data.error != null){
                alert(response.data.error);
              }
              else{
                this.setState({models: response.data.models})
            }            
        })
    }
    getDataModel(selectedModel){
        this.setState({model: selectedModel.model, trademark: selectedModel.trademark, trunk: selectedModel.trunk})
        console.log(this.state)
    }
    UpdateModel(e){
        e.preventDefault()
        if (this.state.model === "" || this.state.trademark === "" || this.state.trunk === ""){
            alert("Alguno de los campos esta vacio")
        }
        else{
            axios.post(c.api + '/ModificarModelo',{
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
        <div style={c.backColor}>
            <Modal.Dialog>
                <Modal.Header>
                <Modal.Title>
                    <center>Modificar modelo</center>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.UpdateModel}>
                        <Dropdown style = {{ margin :5}}>
                            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                                Modelos
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                            {typeof this.state.models !== "undefined" ? this.state.models.map((data, id) =>  <Dropdown.Item key={'model-'+id} onClick={() => this.getDataModel(data)}>{data.model}, {data.trademark}, {data.trunk}</Dropdown.Item>) : <DropdownItem>No modelos disponibles</DropdownItem>}
                            </Dropdown.Menu>
                        </Dropdown>                        
                        <Form.Group controlId="IngresoMarca">
                            <Form.Label>Marca</Form.Label>
                            <Form.Control type="text" value={this.state.trademark} name="trademark" onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="IngresoMarca">
                            <Form.Label>Baul</Form.Label>
                            <Form.Control type="text" value={this.state.trunk} name="trademark" onChange={this.handleChange}/>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Modificar
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
 
export default UpdateModel;