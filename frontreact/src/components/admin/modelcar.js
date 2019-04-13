import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import { Modal, ListGroup, ListGroupItem, Card, CardDeck } from 'react-bootstrap';
/*import axios from 'axios';*/


const c = require('../constants')

class Menuadmin extends Component {
    
    render() {
        return (
        <div style={c.backColor}>
            <Modal.Dialog 
            size="xs"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Body style={c.grayRgb}>
                <CardDeck>
                    <Card style={c.grayRgb} >
                        <center>
                        <h2>Menu Administrador</h2> 
                            <div>
                                <ListGroup>
                                    <ListGroupItem action variant={'light'}>Crear Modelo</ListGroupItem>
                                    <ListGroupItem action variant={'light'}>Consultar Modelo</ListGroupItem>
                                    <ListGroupItem action variant={'light'}>Modificar Modelo</ListGroupItem>
                                    <ListGroupItem action variant={'light'}>Eliminar Modelo</ListGroupItem>
                                    <ListGroupItem action href='/' variant="danger">Cerrar Sección</ListGroupItem>
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