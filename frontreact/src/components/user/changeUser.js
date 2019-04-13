import React, {Component}  from 'react';
import user from '../images/user.png';
import {Modal,Button,Form } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import check from '../images/checked.png';
import error from '../images/error.png';
import ModalMap from '../modalmap';

const c = require('../constants')

class changeUser extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            cellphone: this.props.location.state.cellphone,
            name: '',
            creditCard: '0000000000000000',
            showModal: false,
            point:{
                lat: -1,
                lng: -1
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.getMap = this.getMap.bind(this);
        this.changeUser = this.changeUser.bind(this);
        this.finish = this.finish.bind(this);
    }
    componentWillMount(){

    }
    handleChange(e){
        const { name, value} = e.target;
        this.setState({
            [name]: value
        })
    }
    changeUser(){
        this.props.history.push({pathname: "/Usuario",
        state: { cellphone: this.state.cellphone}})
    }
    getMap(){
        this.setState( { showModal: !this.state.showModal})
    }
    callback (inputPoint){
        this.setState({
            point:{ lat: inputPoint.lat, lng: inputPoint.lng},
            showModal: false
        })
    }
    finish(){
        this.props.history.push({pathname: "/Usuario",
        state: { cellphone: this.state.cellphone}})
    }
    render() {
        let modalClose = () => this.setState({ showModal: false }); 
        return (
        <div style={c.backColor}>
            <Modal.Dialog size="md" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    <center><img alt='' src={user}/> Modificar Información </center>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.changeUser}>
                        <Form.Group controlId="IngresoNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese su nombre" value={this.state.name} name="name" onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="IngresoCelular">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" placeholder="Ingrese su contraseña" name="pass" onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="IngresoDireccion">
                            <Form.Label style={{margin: 5}}>Dirección </Form.Label>
                            <Button style={{margin: 5}} onClick={this.getMap} variant="secondary">Seleccionar</Button>
                            { this.state.point.lat === -1 ? <img style={{margin:5}} alt='' src={error} height={'30'} width={'30'}/> : <img style={{margin:5}} alt='' src={check} height={'30'} width={'30'}/>}
                        </Form.Group>
                        <Form.Group controlId="IngresoTarjetaCredito">
                            <Form.Label>Tarjeta de Credito</Form.Label>
                            <Form.Control type="text" placeholder="Numero de tarjeta" value={this.state.creditCard} name="creditCard" onChange={this.handleChange}/>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Actualizar
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button onClick={this.finish} variant='danger'> Cancelar </Button>
                </Modal.Footer>
            </Modal.Dialog>
            <ModalMap show={this.state.showModal} onHide={modalClose} firstpoint={{lat:-1,lng:-1}} coordinates = { value => this.callback(value)} modoobtener={'true'} linea={'false'}/>
        </div>
        );
    }
}
 
export default withRouter(changeUser);