import React, { Component } from 'react';
import LMap from './map'
import car from './images/logo.png'
import { Button, Modal, Dropdown, ButtonGroup, DropdownButton } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';


const backColor = {
    backgroundColor: '#731E6F',
  };

const pad = {
    margin: 5,
    align: 'center',
    backgroundColor: '#21387C',
    border:'#21387C',
    font: 'black',
    focused:{
        backgroundColor: '#808080'
    }
  }

class Menudriver extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.location.state.name,
            cellphone: this.props.location.state.cellphone
        }
    }
    doSomething = (e) =>{
        console.log(e.latlng)
      }
    render() {
        return (
            <div style={backColor}>
                <Modal.Dialog  size='xs' centered>
                <Modal.Body style={{ backgroundColor: 'rgb(148, 150, 172)'}}>
                    <center>
                        <h2> <img alt='' src={car}/> Menu Conductor</h2> 
                    <h6> Datos: { this.state.name}, {this.state.cellphone} Placa:  </h6>
                    <div>
                    <ButtonGroup vertical>
                    <Button style={pad} >Modificar Información Personal</Button>
                    <Button style={pad}>Modificar Información del Taxi</Button>
                    <Button style={pad}>Cambiar de Taxi</Button>
                    <Button style={pad}>Eliminar Taxi</Button>
                    <Button style={pad}>Eliminar Cuenta</Button>
                    <Button style={pad}>Kilometros Recorridos</Button>
                    <Button style={pad}>Historial</Button>
                    <Button style={pad}>Estado: Libre</Button>
                    <Button style={pad}>¡Hay un Servicio!</Button>
                    <DropdownButton  style={pad} as={ButtonGroup} title="Dropdown" id="bg-vertical-dropdown-3">
                        <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
                        <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
                    </DropdownButton>
                    <Button style = {{    margin: 5, align: 'center'}} href='/' variant="danger">Cerrar Sección</Button>
                    </ButtonGroup>
                    </div>
                    </center>
                    {/*<LMap/>*/}
                    <Button style = {{ margin: 5}} href='/' variant="success" className="float-right">Ver Mapa</Button>
                </Modal.Body>
                </Modal.Dialog>
                {/*La intencion es colocar algo como otro callback o comunicarse entre componentes para usar el botoncito de ver mapa  */}
            </div>
        );
    }
}



export default withRouter(Menudriver);