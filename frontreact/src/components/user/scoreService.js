import React, { Component } from 'react';
import {Modal,Button,Image, Row, Col} from 'react-bootstrap'
import Axios from 'axios';
import {withRouter} from 'react-router-dom';
import stars from '../images/stars.png';
import star from '../images/star.png';


const backColor = {
    backgroundColor: '#731E6F',
};

const api = "http://localhost:4000";
class scoreService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idAsk: this.props.location.state.idAsk,
            stars : [1,2,3,4,5],
            finish: true,
            cellphone: '0000000000',
            star: 0
        }
        this.getScore = this.getScore.bind(this);
        this.goBack = this.goBack.bind(this);
    }
    getScore(starIn){
        console.log(this.state.idAsk)
        Axios.post(api+'/Calificacion',
        {
            idAsk: this.state.idAsk,
            star: starIn

        }).then( response => {
            console.log(response.data.error)
            if( typeof response.data.error !== "undefined"){
                alert(response.data.error)
            }
            else{
                alert("Gracias por calificar el servicio.")
                console.log(response.data.cellphoneclient)
                this.setState({ finish: false, cellphone: response.data.cellphoneclient, idAsk: 0 })
            }
        })
    }
    goBack(){
        this.props.history.push({ pathname: '/Usuario', state: { cellphone: this.state.cellphone}})
    }
    render() { 
        return ( 
            <div style={backColor}>
            <Modal.Dialog
                size="xs"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header>
                <Modal.Title>
                    Calificacion del Servicio: {this.state.service}
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                   <center><img alt='' src={stars} height='100px' width='100px'/></center>
                   <p></p>
                   <Row> 
                   <Col>
                   <center>
                    {this.state.stars.map((data, id) => 
                     <Button key={'star-'+id} variant='light' onClick={() => this.getScore(data)}><Image src={star} height='40' width='40'/><p>{data}</p></Button>
                    )}
                    </center>
                    </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer ><Button disabled={this.state.finish} onClick={this.goBack} variant='danger'>Terminar</Button></Modal.Footer>
            </Modal.Dialog>
            </div>
         );
    }
}
 
export default withRouter(scoreService);