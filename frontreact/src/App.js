import React, { Component } from 'react';
import './App.css';
import CenterLogin from './components/centerLogin'
import Menuser from './components/menuser';
import FirstQuestion from './components/firstquestion';
import Menudriver from './components/menudriver';
import RegisterUser from './components/registerUser';
import ChangeTaxi from './components/changeTaxi';
import {Switch, Route, BrowserRouter} from 'react-router-dom'
import Service from './components/service'

class App extends Component {
  state = { modalShow: true, name: "default", cellphone: "555" };
  render() {
    let modalClose = () => this.setState({ modalShow: false });
    return (
      <BrowserRouter>
      <Switch>
      <Route exact path='/' component={ () => <FirstQuestion/>}/>
      <Route path='/login' component={() =>  <CenterLogin/>}/>
      <Route path='/RegistrarUsuario' component={() =>  <RegisterUser/>}/>
      <Route path='/Usuario' component={() => <Menuser emily={'emily'}/>}/>
      <Route path='/Conductor' component={() => <Menudriver/>}/>
      <Route path='/Taxi' component={ () => < ChangeTaxi/>}/>
      <Route path='/Servicio' component={() => <Service show={this.state.modalShow} onHide={modalClose}/>}/>
      
      <Route path='*' component={() => <Menuser/>}/>
      </Switch>
    </BrowserRouter>
    );
  }
}

export default App;

/*
              <CenterLogin show={this.state.modalShow}
    onHide={modalClose}/>*/