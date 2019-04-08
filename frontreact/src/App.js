import React, { Component } from 'react';
import './App.css';
import CenterLogin from './components/login/centerLogin'
import Menuser from './components/user/menuser';
import FirstQuestion from './components/login/firstquestion';
import Menudriver from './components/driver/menudriver';
import RegisterUser from './components/registerUser';
import ChangeTaxi from './components/driver/changeTaxi';
import Menuadmin from './components/admin/menuadmin';
import ModelCar from './components/admin/modelcar';
import {Switch, Route, BrowserRouter} from 'react-router-dom';
import StartService from './components/user/startservice';
class App extends Component {
  state = { modalShow: true};
  render() {
    return (
      <BrowserRouter>
      <Switch>
      <Route exact path='/' component={ () => <FirstQuestion/>}/>
      <Route path='/login' component={() =>  <CenterLogin/>}/>
      <Route path='/admin' component={() =>  <Menuadmin/>}/>
      <Route path='/modelCar' component={() =>  <ModelCar/>}/>
      <Route path='/Registrar' component={() =>  <RegisterUser/>}/>
      <Route path='/Usuario' component={() => <Menuser emily={'emily'}/>}/>
      <Route path='/Conductor' component={() => <Menudriver/>}/>
      <Route path='/Taxi' component={ () => < ChangeTaxi/>}/>
      <Route path='/Servicio' component={() => <StartService/>}/>
      <Route path='*' component={() => <FirstQuestion/>}/>
      </Switch>
    </BrowserRouter>
    );
  }
}

export default App;