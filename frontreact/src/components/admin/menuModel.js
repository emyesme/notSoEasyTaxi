import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import { Modal, Nav, Col, Tab, Row } from 'react-bootstrap';
import CreateModel from './createModel';
import DeleteModel from './deleteModel';
import ReadModel from './readModel';
import UpdateModel from './updateModel';


const c = require('../constants' )

class menuModel extends Component {
    constructor(props){
        super(props);
        this.state = {
            showCreateModel: false,
            showReadModel: false,
            showUpdateModel: false,
            showDeleteModel: false
        }
        this.goCreateModel = this.goCreateModel.bind(this);
    }
    goCreateModel(){
        this.setState({ showCreateModel: !this.state.showCreateModel})
    }
    render() {
        return (
        <div style={c.backColor}>
            <Modal.Dialog 
            size="xs"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Body style={c.grayRgb}>
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Row>
                    <Col sm={3}>
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                        <Nav.Link eventKey="first">Crear Modelo</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Nav.Link eventKey="second">Ver Modelo</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Nav.Link eventKey="third">Modificar Modelo</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Nav.Link eventKey="fourth">Eliminar Modelo</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    </Col>
                    <Col sm={9}>
                    <Tab.Content>
                        <Tab.Pane eventKey="first">
                        <CreateModel/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="second">
                        <ReadModel/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="third">
                        <UpdateModel/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="fourth">
                        <DeleteModel/>
                        </Tab.Pane>
                    </Tab.Content>
                    </Col>
                </Row>
                </Tab.Container>
            </Modal.Body>
            </Modal.Dialog>
        </div>
        );
    }
}


export default withRouter(menuModel);