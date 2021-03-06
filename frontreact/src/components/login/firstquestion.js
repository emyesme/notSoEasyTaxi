import React, {Component} from 'react';
import {Modal, Row, Col, Image, Button} from 'react-bootstrap'
import car from '../images/car.png'
import user from '../images/user.png'
import {withRouter} from 'react-router-dom'
import admin from '../images/admin.png'

const c = require('../constants')

class FirstQuestion extends Component {
    constructor(props) {
        super(props);
        this.goLogin = this.goLogin.bind(this)
    }
    goLogin(type){
        this.props.history.push(
            {pathname: '/login',
            state: { type: type} })
    }
    goAdmin(){
        this.props.history.push(
            {pathname: '/admin'})
    }
    render() { 
        return (
        <div style={c.backColor}>
            <Modal.Dialog  size="xs" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header >
                <Modal.Title>Como quieres ingresar</Modal.Title>
            </Modal.Header>
                <Row>
                    <Col>
                    <center >
                    <Button onClick={() => this.goLogin('Conductor')} variant="light" style={{ margin: 15}}><Image src={car}/></Button>
                    <p>Conductor</p>
                    </center>
                    </Col>
                    <Col>
                    <center>
                    <Button onClick={() => this.goLogin('Usuario')} variant="light" style={{ margin: 15}}><Image src={user}/></Button>
                    <p>Usuario</p> 
                    </center>
                    </Col>
                    <Col>
                    <center>
                    <Button onClick={() => this.goAdmin()} variant="light" style={{ margin: 15}}><Image src={admin} height='64' width='64' /></Button>
                    <p>Administrador</p> 
                    </center>
                    </Col>
                </Row>
            <Modal.Body>
                
            </Modal.Body>
            </Modal.Dialog>
        </div>
        );
    }
}
 
export default withRouter(FirstQuestion);