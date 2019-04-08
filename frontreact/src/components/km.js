import React, { Component } from 'react';
import { Button, Modal} from 'react-bootstrap';
import Axios from 'axios';


const api = "http://localhost:4000"; 

class kmUse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cellphonetype: this.props.cellphonetype,
            cellphone: this.props.cellphone,
            km: 0
        }
    }
    componentWillMount(){
        Axios.get(api + "/kilometrosRecorridos?cellphone="+this.state.cellphone+"&type="+this.state.cellphonetype)
        .then( response => {
            if( response.data.error != null){
                alert(response.data.error);
            }
            else{
              this.setState({ km : response.data.km})
            }
        }).catch(error => alert(error))
    }
    render() { 
        return (<div>
                    <Modal show={this.props.show}
                    aria-labelledby="contained-modal-title-vcenter"
                    size='sm'
                    centered>
                        <Modal.Body>
                        <center>
                            <h5>Kilometros Recorridos </h5>
                            <p>Estos son los kilometros que haz recorrido, y no se han debitado</p>
                            <h6> { this.state.km } km </h6>
                        </center>
                        </Modal.Body>   
                        <Modal.Footer>
                            <Button variant='danger' onClick={this.props.onHide}>Cancelar</Button>
                        </Modal.Footer>
                    </Modal>
        </div>);
    }
}
 
export default kmUse;