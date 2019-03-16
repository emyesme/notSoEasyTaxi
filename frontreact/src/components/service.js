import React from 'react';
import Service1 from './1service.png'
import Service2 from './2service.png'
import Service3 from './3service.png'
import {Modal,Button,Col, Row, Image} from 'react-bootstrap'


class Service extends React.Component {
    constructor(...args) {
        super(...args);
    
        this.state = { modalShow: false };
      }
    render() {
      return (
        <Modal
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Solicitar un Servicio
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
                <Col xs={6} md={4}>
                    <center>
                    <Image src={Service1} />
                    <h6>Origen</h6>
                    <p>Tu posicion actual</p>
                    </center>
                </Col>
                <Col xs={6} md={4}>
                    <center>
                    <Image src={Service2} />
                    <h6>Destino</h6>
                    <p>
                    Se puede escoger del mapa o tu lista de favoritos
                    </p>
                    <Button variant="outline-secondary">Escoger del mapa</Button>
                    </center>
                </Col>
                <Col xs={6} md={4}>
                    <center>
                    <Image src={Service3} />
                    <h6>Escoger Taxista</h6>
                    <p>
                    El taxista será escogido dependiendo de su cercania a tu posición origen.
                    </p>
                    <Button variant="primary">Buscar Taxi</Button>
                    </center>
                </Col>
            </Row>
            </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={this.props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
    }
  }

export default Service;