import React, { Component } from 'react';
import { Button, Modal, Table} from 'react-bootstrap';
import axios from 'axios';


const api = "http://localhost:4000"; 
class history extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            cellphone: this.props.cellphone,
            data: []
        }
    }
    componentWillMount(){
        axios.get(api+'/Historial?cellphone='+this.state.cellphone+"&cellphonetype="+this.state.type)
        .then( response => {
            if(typeof response.data.error !== 'undefined'){
                alert(response.data.error)
            }
            else{
                this.setState({ data: response.data.historial})
            }            
        }).catch(error => alert(error))
        
    }
    render() { 
        return ( 
            <Modal
              {...this.props}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                  Solicitar un Servicio 
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <Table>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Punto Inicial-Punto Final</th>
                    <th>Distancia (km)</th>
                    <th>Estrellas (1-5)</th>
                    </tr>
                </thead>
                <tbody>
                {
                    this.state.data.map((item, id) => <tr key={id}>
                    <td key={"i0"+id}>{id}</td>
                    <td key={"i2"+id}>({item.xi};{item.yi})<br></br>({item.xf};{item.yf})</td>
                    <td key={"i3"+id}><center>{item.distance/1000} km</center></td>
                    <td key={"i1"+id}><center>{item.stars}</center></td>
                    </tr>
                )}
                 
                </tbody>
                
                </Table>
                
                </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={this.props.onHide}>Cerrar</Button>
              </Modal.Footer>
            </Modal>            
        );
    }
}
 
export default history;