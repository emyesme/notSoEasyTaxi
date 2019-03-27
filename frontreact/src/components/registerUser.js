import React, {Component}  from 'react';
import logo from './images/logo.png'
import {Modal,Button,Form } from 'react-bootstrap'
import {withRouter} from 'react-router-dom'
import axios from 'axios';
import CcDriver from './ccDriver';

const backdropStyle = {
    backgroundColor: '#808080',
  };

const api = "http://localhost:4000";

class RegisterUser extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            type: this.props.location.state.type,
            name: '',
            cedula: '',
            cellphone: '',
            pass: '',
            address: '',
            creditCard: ''
        }
        this.createUser = this.createUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.callback = this.callback.bind(this);
        this.checkEverything = this.checkEverything.bind(this);
    }

    checkEverything(){

        var checkName = function (){
            if (this.state.name !== ''){
                return '';
            }
            return 'El campo nombre esta vacio\n'
        }

        var checkCedula = function (){
            if (this.state.type === 'Usuario'){
                return '';
            }
            if (this.state.type === 'Conductor' && this.state.cedula !== ''){
                return '';
            }
            return 'El campo cedula esta vacio\n'
        }
        var checkCellphone = function (){
            if (this.state.cellphone.length === 10){
                return '';
            }
            return 'El celular debe tener 10 digitos\n'
        }
        var checkPass = function (){
            if (this.state.pass !== ''){
                return '';
            }
            return 'El campo contraseña esta vacio\n'
        }
        var checkAddress = function (){
            if (this.state.type === 'Conductor'){
                return '';
            }
            if (this.state.type === 'Usuario' && this.state.address !== ''){
                return '';
            }
            return 'El campo direccion esta vacio\n'
        }
        var checkNumberBank = function (number){
            if (this.state.creditCard.length === 16){
                return '';
            }
            return 'El numero de la tarjeta debe tener 16 digitos\n'
        }
        var checkMessage = checkName()+checkCedula()+checkCellphone+checkPass+checkAddress+checkNumberBank;
        return checkMessage
    }

    createUser(e){
        e.preventDefault()
        console.log("entro a createUser")
        //una muy linda verificacion que no estoy haciendo sobre tipos de datdos y emas
        
        if ( this.state.name === "" || this.state.cellphone === "" || this.state.pass === "" || this.state.address === "" || this.state.creditCard === ""){
            alert("Alguno de los campos esta vacio")
        }
        else{
            if(this.state.type === "Usuario"){
                axios.post(api + '/RegistrarUsuario',{
                    cellphone: this.state.cellphone,
                    pass: this.state.pass,
                    name: this.state.name,
                    address: this.state.address,
                    creditCard: this.state.creditCard
                    
                }).then( response => {
                    console.log(this.state);    
                    console.log("info enviada")
                    if(response.data.error != null){
                        alert(response.data.error)
                    }
                    else{
                        alert(response.data.mensaje)
                        this.props.history.push(
                            {pathname: "/login",
                            state: { type: this.state.type}})
                    }
                }).catch( error => console.log(error))
            }

                        else{
                if(this.state.type === "Conductor"){
                    axios.post(api + '/RegistrarConductor',{
                        cellphone: this.state.cellphone,
                        pass: this.state.pass,
                        name: this.state.name,
                        cedula: this.state.cedula,
                        creditCard: this.state.creditCard
                        
                    }).then( response => {
                        console.log(this.state);    
                        console.log("info enviada")
                        if(response.data.error != null){
                            alert(response.data.error)
                        }
                        else{
                            alert(response.data.mensaje)
                            this.props.history.push(
                                {pathname: "/login",
                                state: { type: this.state.type}})
                        }
                    }).catch( error => console.log(error))
                }
            }
        }   
    }

    createAxiosAs(typeUser){
        var cedulaOrAddress = this.state.address
        if (this.state.cedula !== ''){
            console.log(typeUser)
            cedulaOrAddress = this.state.cedula
        }
        axios.post(api + '/Registrar' + typeUser,{
            cellphone: this.state.cellphone,
            pass: this.state.pass,
            name: this.state.name,
            cedulaOrAddress: cedulaOrAddress,
            creditCard: this.state.creditCard
        }).then( response => {   
            console.log("info enviada")
            if(response.data.error != null){
                alert(response.data.error)
            }
            else{
                alert(response.data.mensaje)
                this.props.history.push(
                    {pathname: "/login",
                    state: { type: this.state.type}})
            }
        }).catch( error => console.log(error))
    }

    handleChange(e){

        const { name, value} = e.target;
        const numbers = /^[0-9\b]+$|/;
        
        if(e.target.name === "cellphone"){
            if(e.target.value.length <= 10 && (numbers.test(e.target.value) || e.target.value === '')){
                this.setState({
                    [name]: value
                })
            }
            return;
        }
        if(e.target.name === "creditCard"){
            if(e.target.value.length <= 10 && (numbers.test(e.target.value) || e.target.value === '')){
                this.setState({
                    [name]: value
                })
            }
            return;
        }

        this.setState({
            [name]: value
        })
        console.log(this.state)
    }

    callback(inputCC){
        console.log(inputCC)
        this.setState({
            cedula: inputCC
        })
    }

    render() { 
        
        return (
        <div style={backdropStyle}>
            <Modal.Dialog size="md" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    <center><img alt='' src={logo}/>  Registra tu información </center>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.createUser}>
                        <Form.Group controlId="IngresoNombre" >
                            <Form.Label>Nombre</Form.Label >
                            <Form.Control type="text" placeholder="Ingrese su nombre" name="name" onChange={this.handleChange}/>
                        </Form.Group>
                        
                            <CcDriver type = {this.state.type} function1 = {value => this.callback(value)} />
                        
                        <Form.Group controlId="IngresoCelular">
                            <Form.Label>Celular</Form.Label>
                            <Form.Control value = {this.state.cellphone} type="text" placeholder="Ingrese su celular" name="cellphone" onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="IngresoContrasenia">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control value = {this.state.pass} type="password" placeholder="contraseña" name="pass" onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="IngresoDireccion">
                            <Form.Label>Dirección (En coordenadas)</Form.Label>
                            <Form.Control type="text" placeholder="coordenadas" name="address" onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="IngresoTarjetaCredito">
                            <Form.Label>Tarjeta de Credito</Form.Label>
                            <Form.Control value = {this.state.creditCard} type="text" placeholder="Numero de tarjeta" name="creditCard" onChange={this.handleChange}/>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Ingresar
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button href='/' variant='danger'> Cancelar </Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
        );
    }
}
 
export default withRouter(RegisterUser);