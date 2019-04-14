import React, {Component}  from 'react';
import user from '../images/car.png'
import {Modal,Button,Form } from 'react-bootstrap'
import {withRouter} from 'react-router-dom'
import Axios from 'axios';


const c = require('../constants')

class modifyUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            cellphone: this.props.location.state.cellphone,
            pass: '',
            numaccount: '',
            cc: ''
        }
        this.modifyUser = this.modifyUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.finish = this.finish.bind(this);
    }
    componentWillMount(){
        Axios.get(c.api+'/InfoConductor?cellphone='+this.state.cellphone)
        .then(response => {
            if(typeof response.data.error !== 'undefined'){
                alert(response.data.error)
            }
            else{
                this.setState({ name: response.data.name,
                                numaccount: response.data.numaccount,
                                cc: response.data.cc})
            }
        }
        ).catch(error => console.log(error))
    }
    finish(){
        this.props.history.push({
            pathname: '/Conductor',
            state: { cellphone: this.state.cellphone}
        })
    }
    modifyUser(e){
        e.preventDefault()
        //una muy linda verificacion que no estoy haciendo sobre tipos de datos y demas
        if ( this.state.name === "" || this.state.cellphone === ""|| this.state.pass === ""|| this.state.cc === "" || this.state.numaccount === ""){
            alert("Alguno de los campos esta vacio")
        }
        else{
            console.log(this.state)
            Axios.post(c.api + '/ModificarConductor',{
                cellphone: this.state.cellphone,
                pass: this.state.pass,
                name: this.state.name,
                cc: this.state.cc,
                numaccount: this.state.numaccount
            }).then( response => {
                console.log("info enviada")
                if(response.data.error != null){
                    alert(response.data.error)
                }
                else{
                    alert(response.data.mensaje)
                }
            }).catch( error => console.log(error))
        }   
    }
    handleChange(e){
        const { name, value} = e.target;
        this.setState({
            [name]: value
        })
    }
    render() {
        return (
        <div style={c.backdropStyle}>
            <Modal.Dialog size="md" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    <center><img alt='' src={user}/>  Modifica tu información </center>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.modifyUser}>
                        <Form.Group controlId="IngresoNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese su nombre" value={this.state.name} name="name" onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="IngresoContrasenia">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" placeholder="contraseña" name="pass" onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="IngresoCC">
                            <Form.Label>Cedula de Ciudadania</Form.Label>
                            <Form.Control type="text" placeholder="Ingresa cedula" value={this.state.cc} name="cc" onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="IngresoTarjetaCredito">
                            <Form.Label>Numero de Cuenta</Form.Label>
                            <Form.Control type="text" placeholder="Numero de tarjeta" value={this.state.numaccount} name="numaccount" onChange={this.handleChange}/>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Actualizar
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button onClick={this.finish} variant='danger'> Salir </Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
        );
    }
}
 
export default withRouter(modifyUser);