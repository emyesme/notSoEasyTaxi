import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Modal,Button, Form} from 'react-bootstrap';
import check from '../images/checked.png';
import error from '../images/error.png';
import ModalMap from '../modalmap';
import Axios from 'axios';

const c = require('../constants')
class createFav extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            cellphone: this.props.cellphone,
            point:{
                lat: -1,
                lng: -1
            },
            nameFav: '',
            showModal: false,
            cannotAdd: true
        }
        this.saveInfo = this.saveInfo.bind(this);
        this.getMap = this.getMap.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }
    saveInfo(e){
        e.preventDefault()
        if( this.state.name === "" || this.state.point.lat === -1){
            alert("Ingrese todos los campos")
            return;
        }
        Axios.post(c.api+'/crearFavorito',{
            cellphone: this.state.cellphone,
            name: this.state.nameFav,
            coordinateX: this.state.point.lat,
            coordinateY: this.state.point.lng
        }).then( response => {
            console.log(response.data)
            if(typeof response.data.error !== "undefined"){
                alert(response.data.error)
            }
            else{
                if(this.state.cellphone === response.data.cellphoneclient){
                    alert("Lugar Favorito añadido correctamente")
                    this.props.history.push({ pathname: '/Usuario', state: { cellphone: this.state.cellphone}})
                }
            }
        }).catch(error => alert(error))
    }
    getMap(){
        this.setState({ showModal: true})
    }
    handleChange(e){
        const { name, value} = e.target;
        this.setState({
            [name]: value
        })
    }
    callback (inputPoint){
        this.setState({
            point:{ lat: inputPoint.lat, lng: inputPoint.lng},
            showModal: false,
            cannotAdd: false
        })

    }
    render() {
        let modalClose = () => this.setState({ showModal: false }); 
        return (
            <div>
            <Modal
            {...this.props}
            size="sm"
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
            <Button disabled={this.state.cannotAdd} style= {c.padCreateFav} variant="success" type="submit">
                Agregar
            </Button>
            </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={this.props.onHide}>Close</Button>
            </Modal.Footer>
          </Modal>
          <ModalMap show={this.state.showModal} onHide={modalClose} firstpoint={{lat:-1,lng:-1}} coordinates = { value => this.callback(value)} modoObtener={'true'} linea={'false'}/>
          </div>
        );
    }
}
 
export default withRouter(createFav);