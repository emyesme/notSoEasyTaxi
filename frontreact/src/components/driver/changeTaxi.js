import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import car from '../images/logo.png'
import check from '../images/checked.png';
import error from '../images/error.png';
import ModalMap from '../modalmap';
import { Button, Form, Modal, Col, Row, ListGroup, Dropdown} from 'react-bootstrap';
import axios from 'axios';
import DropdownItem from 'react-bootstrap/DropdownItem';


const c = require('../constants')

class changeTaxi extends Component {
    constructor(props) {
        super(props);
        this.state={
            cellphone: this.props.location.state.cellphone,
            plaque: this.props.location.state.plaque,
            soat: '',
            year: '',
            models: [],
            mode: '',
            trademark: '',
            trunk: '',
            show: false,
            showModal: false,
            point: {
                lat: this.props.location.state.point.lat,
                lng: this.props.location.state.point.lng
            },
            info: this.props.location.state.enable
            //nombre, celular y placa para cuando vuelva a la ventana
        };
        this.handleChange = this.handleChange.bind(this);
        this.addTaxi = this.addTaxi.bind(this);
        this.changeTaxi = this.changeTaxi.bind(this);
        this.verifyPlaque = this.verifyPlaque.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.finish = this.finish.bind(this);
        this.getMap = this.getMap.bind(this);
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
    getDataModel(selectedModel){
        this.setState({ model: selectedModel.model, trademark: selectedModel.trademark, trunk: selectedModel.trunk})
        console.log(selectedModel)
    }
    componentWillMount(){
        axios.get(c.api+'/Modelos')
        .then( response => {
            if( response.data.error != null){
                alert(response.data.error);
              }
              else{
                this.setState({models: response.data.models})
            }            
        })
    }
    changeTaxi(){
        if(this.state.point.lat === -1){
            alert("Ingrese una posicion actual para el taxi")
            return
        }
        axios.post(c.api + '/CambiarTaxi',{
            plaque: this.state.plaque,
            cellphone: this.state.cellphone,
            point: { x: this.state.point.lat, y: this.state.point.lng}
        }).then( response => {
            console.log(response.data)
            if(typeof response.data.error !== 'undefined'){
                alert(response.data.error)
            }
            else{
                alert(response.data.mensaje)
                this.props.history.push({pathname: "/Conductor",
                state: { cellphone: this.state.cellphone}})
            }
        }).catch( error => alert("Se presento un error al comunicarse con el api."))
    }
    addTaxi(e){
        if ( (this.state.plaque === "") && (this.state.soat === "") && (this.state.trademark === "") && (this.state.trunk === "") && (this.state.year === "")){
            alert ("Alguno de los campos esta vacio.")
        }
        else{
            e.preventDefault()
            axios.post(c.api+'/AdicionarTaxi',{
                plaque: this.state.plaque,
                model: this.state.model,
                soat: this.state.soat,
                year: this.state.year,
                point: { x: this.state.point.lat, y: this.state.point.lng}
            }).then( response => {
                if( response.data.error != null){
                    console.log(response.data.error)
                    alert("Se presento un error al ingresar el taxi.")
                    return
                }
                else{
                    alert(response.data.mensaje)
                }
                this.changeTaxi()
            }).catch( error=> alert(error))
        }
    }
    handleChange(e){
        const { name, value} = e.target;
        this.setState({
            [name]: value
        })
    }
    verifyPlaque(){
        if( this.state.plaque === ""){
            alert("Alguno de los campos esta vacio")
            return
        }
        axios.get(c.api + "/Placa?plaque="+this.state.plaque)
        .then( response => {
            if( response.data.error != null){
                alert("No se encontro un vehiculo con la placa ingresada, adicione el taxi");
                this.setState({ info: false})
            }
            else{
                this.setState({show: true, soat: response.data.soat, year: response.data.year, model: response.data.model});
                for (const i in this.state.models){
                    if ( this.state.models[i].model === this.state.model){
                        this.setState({ trademark: this.state.models[i].trademark, trunk : this.state.models[i].trunk})
                    }
                }
            }
        }).catch( err => alert(err))
    }
    closeModal(){
        this.setState({show: !this.state.show})
    }
    finish(){
        this.props.history.push({
            pathname: '/Conductor',
            state : {cellphone: this.state.cellphone}
        })
    }
    render() { 
        let modalClose = () => this.setState({ showModal: false });
        return (
            <div style={c.backColor}>
                <div>
                    <Modal show={this.state.show} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Body>
                    <h6>Información Encontrada: </h6>
                        <ListGroup>
                            <ListGroup.Item>
                                Placa: {this.state.plaque}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Modelo: {this.state.model}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Año: {this.state.year}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Marca: {this.state.trademark}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Baul: {this.state.trunk}
                            </ListGroup.Item>
                        </ListGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='success' onClick={this.changeTaxi}>Si, Cambiar</Button>
                        <Button variant='danger' onClick={this.closeModal}>Cancelar</Button>
                    </Modal.Footer>
                    </Modal>
                </div>
                <Modal.Dialog size='xs' centered>
                    <Modal.Body>
                        <Form onSubmit={this.addTaxi} enable={'false'}>
                        <h2> <img alt='' src={car}/> Cambiar Taxi</h2>
                        <p>Ingresa los datos del vehiculo: </p>
                        <Form.Group controlId="formPlaque">
                            <Form.Label>Placa</Form.Label>
                        <Row>
                            <Col>
                            <Form.Control disabled={!this.state.info} value={this.state.plaque} style={c.pad} type="Placa" placeholder="Placa" name="plaque" onChange={this.handleChange}/>
                            </Col>
                            <Col>
                            <Button disabled={!this.state.info} onClick={this.verifyPlaque} variant='secondary'> Verificar </Button>
                            </Col>
                        </Row>
                        </Form.Group>
                        <Dropdown style = {{ margin :5}}>
                        <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                            Modelos
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                        {typeof this.state.models !== "undefined" ? this.state.models.map((data, id) =>  <Dropdown.Item key={'model-'+id} onClick={() => this.getDataModel(data)}>{data.model}, {data.trademark}, {data.trunk}</Dropdown.Item>) : <DropdownItem>No modelos disponibles</DropdownItem>}
                        </Dropdown.Menu>
                        </Dropdown> 
                        <Form.Group controlId="IngresoDireccion">
                            <Form.Label style={{margin: 5}}>Posicion Actual</Form.Label>
                            <Button style={{margin: 5}} onClick={this.getMap} variant="secondary">Seleccionar</Button>
                            { this.state.point.lat === this.props.location.state.point.lat ? <img style={{margin:5}} alt='' src={error} height={'30'} width={'30'}/> : <img style={{margin:5}} alt='' src={check} height={'30'} width={'30'}/>}
                        </Form.Group>
                        <Form.Group controlId="formSoat">
                            <Form.Label>Soat</Form.Label>
                            <Form.Control disabled={this.state.info} type="text" placeholder="Soat" name="soat" onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="formYear">
                            <Form.Label>Año</Form.Label>
                            <Form.Control disabled={this.state.info} type="integer" placeholder="Año" name="year" onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group  controlId="formModel" >
                            <Form.Label>Modelo</Form.Label >                           
                        </Form.Group>
                        <Button variant='primary' style= {c.pad} type="submit">
                            Cambiar
                        </Button>
                        <Button variant='danger' onClick={this.finish} style= {c.pad} className="float-right">
                            Cancelar
                        </Button>
                        </Form>
                    </Modal.Body>
                </Modal.Dialog>
                <ModalMap show={this.state.showModal} onHide={modalClose} firstpoint={{lat:-1,lng:-1}} coordinates = { value => this.callback(value)} modoobtener={'true'} linea={'false'}/>
            </div>
        );
    }
}
 
export default withRouter(changeTaxi);