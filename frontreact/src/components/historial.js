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
                    <th>Punto Inicial</th>
                    <th>Punto Final</th>
                    <th>Distancia</th>
                    </tr>
                </thead>
                <tbody>
                
                {
                    this.state.data.map((item, id) => <tr key={id}>
                    <td key={"i0"+id}>{id}</td>
                    <td key={"i2"+id}>({item.xi};{item.yi})</td>
                    <td key={"i3"+id}>({item.xf};{item.yf})</td>
                    <td key={"i1"+id}>{item.distance}</td>
                    </tr>
                )}
                 
                </tbody>
                
                </Table>
                
                </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={this.props.onHide}>Close</Button>
              </Modal.Footer>
            </Modal>            
        );
    }
}
 
export default history;