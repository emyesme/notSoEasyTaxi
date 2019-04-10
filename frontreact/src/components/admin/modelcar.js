import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import { Modal, Button, ButtonGroup, Card, CardDeck } from 'react-bootstrap';
/*import axios from 'axios';*/

const backColor = {
    backgroundColor: '#731E6F',
};

const pad = {
    margin : 5,
    align: 'center'
}


const grayRgb = {
    backgroundColor: 'rgb(148, 150, 172)',
}



class Menuadmin extends Component {
    
    render() {
        return (
        <div style={backColor}>
            <Modal.Body style={grayRgb}>
                <CardDeck>
                    <Card style={grayRgb} >
                        <center>
                        <h2>Menu Administrador</h2> 
                            <div>
                                <ButtonGroup vertical>
                                    <Button style={pad}>Crear Modelo</Button>
                                    <Button style={pad}>Consultar Modelo</Button>
                                    <Button style={pad}>Modificar Modelo</Button>
                                    <Button style={pad}>Eliminar Modelo</Button>
                                    <Button style = {{margin: 5, align: 'center'}} href='/' variant="danger">Cerrar Sección</Button>
                                </ButtonGroup>
                            </div>
                        </center>
                    </Card>
                    
                </CardDeck>
            </Modal.Body>
            
        </div>
        );
    }
}


export default withRouter(Menuadmin);