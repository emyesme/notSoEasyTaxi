import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import { Modal,ListGroup, ListGroupItem, Card, CardDeck } from 'react-bootstrap';
import DeleteDriver from './deleteDriver';
import DeleteUser from './deleteUser';

const c = require('../constants')

class Menuadmin extends Component {
    constructor(props){
        super(props);
        this.state = {
            showModalDeleteUser: false,
            showModalDeleteDriver: false
        }
        this.goDeleteDriver = this.goDeleteDriver.bind(this);
        this.goDeleteUser = this.goDeleteUser.bind(this);
    }
    goDeleteDriver(){
        this.setState({ showModalDeleteDriver: true})
    }
    goDeleteUser(){
        this.setState({ showModalDeleteUser: true})
    }
    render() {
        let modalCloseDeleteUser = () => this.setState({ showModalDeleteUser: false});
        let modalCloseDeleteDriver = () => this.setState({ showModalDeleteDriver: false});
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
                                    <ListGroupItem action onClick={this.goDeleteUser} variant='light'>Eliminar Cliente</ListGroupItem>
                                    <ListGroupItem action onClick={this.goDeleteDriver} variant='light'>Eliminar Conductor</ListGroupItem>
                                    <ListGroupItem action  href='/' variant="danger">Cerrar Sesión</ListGroupItem>
                                </ListGroup>
                            </div>
                        </center>
                    </Card>
                    
                </CardDeck>
            </Modal.Body>
            </Modal.Dialog>
            <DeleteUser show={this.state.showModalDeleteUser} onHide={modalCloseDeleteUser}/>    
            <DeleteDriver show={this.state.showModalDeleteDriver} onHide={modalCloseDeleteDriver}/> 
        </div>
        );
    }
}


export default withRouter(Menuadmin);