import React, { Component } from 'react';
import './App.css';
import CenterLogin from './components/login/centerLogin'
import Menuser from './components/user/menuser';
import FirstQuestion from './components/login/firstquestion';
import Menudriver from './components/driver/menudriver';
import RegisterUser from './components/registerUser';
import ChangeTaxi from './components/driver/changeTaxi';
import Menuadmin from './components/admin/menuadmin';
import MenuModel from './components/admin/menuModel';
import {Switch, Route, BrowserRouter} from 'react-router-dom';
import StartService from './components/user/startservice';
import ScoreService from './components/user/scoreService';
import RegisterDriver from './components/driver/registerDriver';
import ChangeUser from './components/user/changeUser';
class App extends Component {
  state = { modalShow: true};
  render() {
    return (
      <BrowserRouter>
      <Switch>
      <Route exact path='/' component={ () => <FirstQuestion/>}/>
      <Route path='/login' component={() =>  <CenterLogin/>}/>
      <Route path='/admin' component={() =>  <Menuadmin/>}/>
      <Route path='/Modelo' component={() =>  <MenuModel/>}/>
      <Route path='/RegistrarUsuario' component={() =>  <RegisterUser/>}/>
      <Route path='/RegistrarConductor' component={() =>  <RegisterDriver/>}/>
      <Route path='/ActualizarUsuario' component={() => <ChangeUser/>}/>
      <Route path='/Usuario' component={() => <Menuser/>}/>
      <Route path='/Conductor' component={() => <Menudriver/>}/>
      <Route path='/Taxi' component={ () => < ChangeTaxi/>}/>
      <Route path='/Servicio' component={() => <StartService/>}/>
      <Route path='/Calificar' component={() => <ScoreService/>}/>
      <Route path='*' component={() => <FirstQuestion/>}/>
      </Switch>
    </BrowserRouter>
    );
  }
}

export default App;