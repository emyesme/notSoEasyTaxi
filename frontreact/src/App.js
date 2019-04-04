import React, { Component } from 'react';
import './App.css';
import CenterLogin from './components/login/centerLogin'
import Menuser from './components/user/menuser';
import FirstQuestion from './components/login/firstquestion';
import Menudriver from './components/driver/menudriver';
import RegisterUser from './components/registerUser';
import ChangeTaxi from './components/driver/changeTaxi';
import {Switch, Route, BrowserRouter} from 'react-router-dom';
import Service from './components/user/service';

class App extends Component {
  state = { modalShow: true, name: "default", cellphone: "555" };
  render() {
    let modalClose = () => this.setState({ modalShow: false });
    return (
      <BrowserRouter>
      <Switch>
      <Route exact path='/' component={ () => <FirstQuestion/>}/>
      <Route path='/login' component={() =>  <CenterLogin/>}/>
      <Route path='/Registrar' component={() =>  <RegisterUser/>}/>
      <Route path='/Usuario' component={() => <Menuser emily={'emily'}/>}/>
      <Route path='/Conductor' component={() => <Menudriver/>}/>
      <Route path='/Taxi' component={ () => < ChangeTaxi/>}/>
      <Route path='/Servicio' component={() => <Service show={this.state.modalShow} onHide={modalClose}/>}/>
      <Route path='*' component={() => <FirstQuestion/>}/>
      </Switch>
    </BrowserRouter>
    );
  }
}

export default App;

/*
              <CenterLogin show={this.state.modalShow}
    onHide={modalClose}/>*/