import React from 'react';
import Service1 from '../images/1service.png'
import Service2 from '../images/2service.png'
import Service3 from '../images/3service.png'
import {Modal,Button,Col, Row, Image} from 'react-bootstrap'
import ModalMap from '../modalmap';
import check from '../images/checked.png';
import error from '../images/error.png';
class Service extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          modalShowOrigin: false,
          modalShowDestiny: false,
          point:{
            lat: 1,
            lng: 1
          },
          destiny: {
            lat: 1,
            lng: 1
          }
        };
        this.getModalMapOrigin = this.getModalMapOrigin.bind(this);
        this.getModalMapDestiny = this.getModalMapDestiny.bind(this);
        this.callbackOrigin = this.callbackOrigin.bind(this);
        this.callbackDestiny = this.callbackDestiny.bind(this);
    }
    getModalMapDestiny(){
      this.setState({ modalShowDestiny: !this.state.modalShowDestiny})
    }
    getModalMapOrigin(){
      this.setState( { modalShowOrigin: !this.state.modalShowOrigin})
    }
    callbackOrigin(inputPoint){
      this.setState({
          point:{ lat: inputPoint.lat, lng: inputPoint.lng},
          modalShowOrigin: !this.state.modalShowOrigin
      })
    }
    callbackDestiny(inputPoint){
      this.setState({
          destiny:{ lat: inputPoint.lat, lng: inputPoint.lng},
          modalShowDestiny: !this.state.modalShowDestiny
      })
    }
    render() {
      let modalCloseOrigin = () => this.setState({ modalShowOrigin: false });
      let modalCloseDestiny = () => this.setState({ modalShowDestiny: false });
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
            <Row>
                <Col xs={6} md={4}>
                    <center>
                    <Image src={Service1} />
                    <h6>Origen</h6>
                    <p>Tu posicion actual</p>
                    <Button onClick={this.getModalMapOrigin} variant="outline-secondary">Tomar posición</Button>
                    { this.state.point.lat === 1 ? <img style={{margin:5}} alt='' src={error} height={'30'} width={'30'}/> : <img style={{margin:5}} alt='' src={check} height={'30'} width={'30'}/>}
                    </center>
                </Col>
                <Col xs={6} md={4}>
                    <center>
                    <Image src={Service2} />
                    <h6>Destino</h6>
                    <p>
                    Se puede escoger del mapa o tu lista de favoritos
                    </p>
                    <Button onClick={this.getModalMapDestiny} variant="outline-secondary">Escoger del mapa</Button>
                    { this.state.destiny.lat === 1 ? <img style={{margin:5}} alt='' src={error} height={'30'} width={'30'}/> : <img style={{margin:5}} alt='' src={check} height={'30'} width={'30'}/>}
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
        <ModalMap show={this.state.modalShowOrigin} onHide={modalCloseOrigin} firstpoint={this.props.firstpoint} coordinates = { value => this.callbackOrigin(value)}/>
        <ModalMap show={this.state.modalShowDestiny} onHide={modalCloseDestiny} firstpoint={this.props.firstpoint} coordinates = { value => this.callbackDestiny(value)}/>
        </div>
      );
    }
  }

export default Service;