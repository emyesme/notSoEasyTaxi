import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap'


class CcDriver extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '',
            cedula: ''
        }
    }

    handleChange = e => {

        const value = e.target.value;
        this.props.function1(value);

    }

    render() {
        return (

            <Form.Group controlId="IngresoCedula"
                {...this.props}>

                {this.props.type === 'Conductor' ? <div>
                    <Form.Label>Cedula</Form.Label >
                    <Form.Control type="text" placeholder= "Ingrese su cedula" cedula="cedula" onChange={this.handleChange} />

                </div> : <div><Button variant='danger'> Direccion </Button></div>}
            </Form.Group>
        )
    }
}

export default CcDriver;