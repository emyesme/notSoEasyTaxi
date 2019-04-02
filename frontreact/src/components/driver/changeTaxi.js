import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import car from '../images/logo.png'
import { Button, Form, Modal, Col, Row, ListGroup} from 'react-bootstrap';
import axios from 'axios';

const backColor = {
    backgroundColor: '#731E6F',
};

const pad = {
    margin : 5,
    align: 'center'
}

const api = "http://localhost:4000";

class changeTaxi extends Component {
    constructor(props) {
        super(props);
        this.state={
            user: this.props.location.state.user,
            plaque: '',
            model: '',
            soat: '',
            year: '',
            trademark: '',
            trunk: '',
            show: false
            //nombre, celular y placa para cuando vuelva a la ventana
        };
        this.handleChange = this.handleChange.bind(this)
        this.addTaxi = this.addTaxi.bind(this)
        this.changeTaxi = this.changeTaxi.bind(this)
        this.verifyPlaque = this.verifyPlaque.bind(this)
    }
    changeTaxi(){
        console.log(api + '/CambiarTaxi')
        axios.post(api + '/CambiarTaxi',{
            plaque: this.state.plaque,
            cellphone: this.state.user,
            date: new Date()
        }).then( response => {
            if(response.data.error != null){
                alert(response.data.error)
            }
            else{
                alert(response.data.mensaje)
                this.props.history.push("/")
            }
        }).catch( error => console.log(error))
    }
    addTaxi(){
        if ( (this.state.plaque === "") && (this.state.soat === "") && (this.state.trademark === "") && (this.state.trunk === "") && (this.state.year === "")){
            alert ("Alguno de los campos esta vacio.")
        }
        else{

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
        axios.get(api + "/Placa?plaque="+this.state.plaque)
        .then( response => {
            if( response.data.error != null){
                alert("No se encontro un vehiculo con la placa ingresada, adicione el taxi");
            }
            else{
                this.setState({show: true, soat: response.data.soat, year: response.data.year, model: response.data.model, trademark: response.data.trademark, trunk: response.data.trunk});
            }
        }).catch( err => alert(err))
    }
    render() { 
        return (
            <div style={backColor}>
                {/*Informacion*/}
                <div>
                    <Modal show={this.state.show} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Body>
                    Información Encontrada: 
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
                        <Button onClick={this.changeTaxi}>Si, Cambiar</Button>
                        <Button href="/">Cancelar</Button>
                    </Modal.Footer>
                    </Modal>
                </div>
                <Modal.Dialog size='xs' centered>
                    <Modal.Body>
                        <Form onSubmit={this.addTaxi}>
                        <h2> <img alt='' src={car}/> Cambiar Taxi</h2>
                        <p>Ingresa los datos del vehiculo: </p>
                        <Form.Group controlId="formPlaque">
                            <Form.Label>Placa</Form.Label>
                        <Row>
                            <Col>
                            <Form.Control style={pad} type="Placa" placeholder="Placa" name="plaque" onChange={this.handleChange}/>
                            </Col>
                            <Col>
                            <Button onClick={this.verifyPlaque} variant='secondary'> Verificar </Button>
                            </Col>
                        </Row>
                        </Form.Group>
                        <Form.Group controlId="formModel">
                        <Row>
                            <Col>
                            <Form.Label>Modelo</Form.Label>
                            <Form.Control type="text" placeholder="Modelo" name="model" onChange={this.handleChange}/>
                            </Col>
                        </Row>
                        </Form.Group>
                        <Form.Group controlId="formSoat">
                            <Form.Label>Soat</Form.Label>
                            <Form.Control type="text" placeholder="Soat" name="soat" onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="formYear">
                            <Form.Label>Año</Form.Label>
                            <Form.Control type="text" placeholder="Año" name="year" onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="formCompany">
                            <Form.Label>Marca</Form.Label>
                            <Form.Control type="text" placeholder="Marca" name="trademark" onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="formTrunk">
                            <Form.Label>Baul</Form.Label>
                            <Form.Control type="text" placeholder="Baul" name="trunk" onChange={this.handleChange}/>
                        </Form.Group>
                        <Button variant='primary' style= {pad} type="submit">
                            Cambiar
                        </Button>
                        <Button variant='danger' style= {pad} href="/">
                            Cancelar
                        </Button>
                        </Form>
                    </Modal.Body>
                </Modal.Dialog>
            </div>
        );
    }
}
 
export default withRouter(changeTaxi);