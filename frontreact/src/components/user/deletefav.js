import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Modal,Button, Dropdown} from 'react-bootstrap';
import DropdownItem from 'react-bootstrap/DropdownItem';
import Axios from 'axios';

const c = require('../constants')

class deleteFav extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            cellphone: this.props.cellphone,
            markers: this.props.markers,
            point:{
                x: -1,
                y: -1
            },
            name: '',
            cannotAdd: true
        }
        this.deleteFav = this.deleteFav.bind(this);
        this.getPoint = this.getPoint.bind(this);

    }
    getPoint(data){
        this.setState({name: data.namecoordinate, point: { x: data.point.x, y: data.point.y}, cannotAdd: false})
        
    }
    deleteFav(e){
        e.preventDefault()
        if( this.state.name === "" || this.state.point.lat === -1){
            alert("Ingrese todos los campos")
            return;
        }
        Axios.delete(c.api+'/eliminarFavorito?cellphone='+this.state.cellphone+'&coordinateX='+this.state.point.x+'&coordinateY='+this.state.point.y)
        .then( response => {
            if(typeof response.data.error !== "undefined"){
                alert(response.data.error)
            }
            else{
                if(this.state.cellphone === response.data.cellphoneclient){
                    alert("Lugar Favorito eliminado correctamente")
                    this.props.history.push({ pathname: '/Usuario', state: { cellphone: this.state.cellphone}})
                }
            }
        }).catch(error => alert(error))
    }

    render() {
        return (
            <div>
            <Modal
            {...this.props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header>
              <Modal.Title id="contained-modal-title-vcenter">
                Eliminar Lugar Favorito
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Dropdown style = {{ margin :5}}>
                        <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                            Marcadores
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                        {typeof this.props.markers !== "undefined" ? this.props.markers.map((data, id) =>  <Dropdown.Item key={'m-'+id} onClick={() => this.getPoint(data)}>{data.namecoordinate}</Dropdown.Item>) : <DropdownItem>No hay marcadores disponibles</DropdownItem>}
                        </Dropdown.Menu>
            </Dropdown>
            <Button disabled={this.state.cannotAdd} style={c.pad} variant="success" onClick={this.deleteFav}>
                Eliminar
            </Button>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={this.props.onHide}>Cerrar</Button>
            </Modal.Footer>
          </Modal>
          </div>
        );
    }
}
 
export default withRouter(deleteFav);