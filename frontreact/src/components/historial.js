import React, { Component } from 'react';
import { Button, Modal} from 'react-bootstrap';
import axios from 'axios';


class history extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            cellphone: this.cellphone
        }
    }
    render() { 
        return ( 
            <div>
            <Modal
              {...this.props}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                  Solicitar un Servicio 
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  tabla
                </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={this.props.onHide}>Close</Button>
              </Modal.Footer>
            </Modal>
        </div>            
        );
    }
}
 
export default history;