import React, { Component } from 'react';
import LMap from './map'
import car from './images/logo.png'
import { Button } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';

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
            <div>
                <Button href="/" variant="danger">  Login </Button>
                <center>
                    <h2> <img alt='' src={car}/> Menu Conductor</h2> 
                    <h6> Datos: { this.state.name}, {this.state.cellphone} </h6>
                </center>
                <LMap/>
            </div>
        );
    }
}



export default withRouter(Menudriver);