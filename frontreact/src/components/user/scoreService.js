import React, { Component } from 'react';
import {Modal,Button,Image} from 'react-bootstrap'
import Axios from 'axios';
import {withRouter} from 'react-router-dom';
import star from '../images/stars.png';


const backColor = {
    backgroundColor: '#731E6F',
};

class scoreService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idAsk: this.props.location.state.idAsk
        }
    }
    render() { 
        return ( 
            <div style={backColor}>
            <Modal.Dialog
                size="xs"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header>
                <Modal.Title>
                    Calificacion del Servicio: {this.state.service}
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                   <center><img alt='' src={star} height='100px' width='100px'/></center> 
                </Modal.Body>
                <Modal.Footer ><Button href="/" variant='danger'>Solo programadores</Button></Modal.Footer>
            </Modal.Dialog>
            </div>
         );
    }
}
 
export default withRouter(scoreService);