import React, { Component } from 'react';
import LMap from './map'
import car from './car-insurance.png'
import { Button } from 'react-bootstrap';


class Menuser extends Component {
    doSomething = (e) =>{
        console.log(e.latlng)
      }
    render() {
        return (
            <div>
                <Button href="/" variant="danger">  Login </Button>
                <center> <h2> <img alt='' src={car}/> Menu Usuario</h2> </center>
                <LMap/>
            </div>
        );
    }
}


export default Menuser;
