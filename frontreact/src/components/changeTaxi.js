import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import car from './images/logo.png'
import { Button, Form, Modal} from 'react-bootstrap';

const backColor = {
    backgroundColor: '#731E6F',
};

class changeTaxi extends Component {
    constructor(props) {
        super(props);
        console.log("Taxi")
    }
    render() { 
        return (
            <div style={backColor}>
                <Modal.Dialog  centered>
                    <Modal.Body>
                        <Form>
                        <h2> <img alt='' src={car}/> Cambiar Taxi</h2>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                            <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        <Form.Group controlId="formBasicChecbox">
                            <Form.Check type="checkbox" label="Check me out" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                        <Button href="/" variant="danger" >
                            Cerrar
                        </Button>
                        </Form>
                    </Modal.Body>
                </Modal.Dialog>
            </div>
        );
    }
}
 
export default withRouter(changeTaxi);