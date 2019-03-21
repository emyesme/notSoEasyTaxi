import React, { Component } from 'react';
import { Form } from 'react-bootstrap'


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

                {this.props.type === 'Usuario' ? <div>
                    <Form.Label>Cedula</Form.Label >
                    <Form.Control type="text" placeholder={this.props.type} cedula="cedula" onChange={this.handleChange} />

                </div> : <div>holiiiii</div>}
            </Form.Group>
        )
    }
}

export default CcDriver;