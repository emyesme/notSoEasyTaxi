import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Modal,Button, Form} from 'react-bootstrap';
import check from '../images/checked.png';
import error from '../images/error.png';


const pad = {
    margin: 5,
    align: 'center',
    backgroundColor: '#21387C',
    border:'#21387C',
    font: 'white'
}

class createFav extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            cellphone: this.props.cellphone,
            point:{
                lat: -1,
                lng: -1
            },
            nameFav: ''
        }
        this.saveInfo = this.saveInfo.bind(this);
        this.getMap = this.getMap.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    saveInfo(){

    }
    getMap(){

    }
    handleChange(e){
        const { name, value} = e.target;
        this.setState({
            [name]: value
        })
    }
    render() { 
        return (
            <Modal
            {...this.props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header>
              <Modal.Title id="contained-modal-title-vcenter">
                Crear Lugar Favorito 
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form onSubmit={this.saveInfo}>
            <Form.Group controlId="IngresoUsuario">
                <Form.Label>Celular del </Form.Label>
                <Form.Control type="text" placeholder="Nombre lugar favorito" name="nameFav" onChange={this.handleChange}/>
            </Form.Group>
            <Button style={{margin: 5}} onClick={this.getMap} variant="secondary">Seleccionar</Button>
            { this.state.point.lat === -1 ? <img style={{margin:5}} alt='' src={error} height={'30'} width={'30'}/> : <img style={{margin:5}} alt='' src={check} height={'30'} width={'30'}/>}
            <Button style={pad} variant="success" type="submit">
                Agregar
            </Button>
            </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={this.props.onHide}>Close</Button>
            </Modal.Footer>
          </Modal>
        );
    }
}
 
export default withRouter(createFav);