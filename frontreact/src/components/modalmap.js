import React from 'react';
import LMap from './map';
import marker from './images/setPlace.svg';
import {Modal,Button, Image} from 'react-bootstrap';

class modalmap extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            showModal: false,
            point:{
                lat: 1,
                lng: 1,
            },
            noPunto: true
        };
        this.getPoint = this.getPoint.bind(this)
    }
    callback (inputPoint){
        this.setState({
            point:{ lat: inputPoint.lat, lng: inputPoint.lng},
        });
        if (this.state.point !== 1){
            this.setState({ noPunto: false})
        }
    }
    getPoint(){
        console.log(this.state.point)
        this.props.coordinates(this.state.point)
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
                    <Image src={marker} height={'50'} width={'50'}/>
                    Seleccionar el Punto    
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <center>
                    <LMap  height={'300px'} width={'100%'} markers={[]} origin={this.props.firstpoint} point = { value => this.callback(value)} modoObtener={true}/>
                    </center>
                </Modal.Body>
                <Modal.Footer>
                <Button disabled={this.state.noPunto} onClick={this.getPoint} variant="primary">Guardar Ubicación Seleccionada</Button>
                <Button variant="danger" onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
      );
    }
  }

export default modalmap;