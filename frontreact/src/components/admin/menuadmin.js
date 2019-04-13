import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import { Modal,ListGroup, ListGroupItem, Card, CardDeck } from 'react-bootstrap';

const c = require('../constants')

class Menuadmin extends Component {

    goModelCar(){
        this.props.history.push({
            pathname: "/ModelCar"})
    }
    
    render() {
        return (
        <div style={c.backColor}>
            <Modal.Dialog 
            size="xs"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Body>
                <CardDeck>
                    <Card>
                        <center>
                        <h2>Menu Administrador</h2> 
                            <div>
                                <ListGroup>
                                    <ListGroupItem action variant='light' href='/Modelo'>Modelos</ListGroupItem>
                                    <ListGroupItem action variant='light'>Eliminar Cliente</ListGroupItem>
                                    <ListGroupItem action variant='light'>Eliminar Conductor</ListGroupItem>
                                    <ListGroupItem action  href='/' variant="danger">Cerrar Sección</ListGroupItem>
                                </ListGroup>
                            </div>
                        </center>
                    </Card>
                    
                </CardDeck>
            </Modal.Body>
            </Modal.Dialog>    
        </div>
        );
    }
}


export default withRouter(Menuadmin);