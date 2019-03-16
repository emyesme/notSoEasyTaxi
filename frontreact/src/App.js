import React, { Component } from 'react';
import './App.css';
import CenterLogin from './components/centerLogin'
import Menuser from './components/menuser';
import Menudriver from './components/menudriver';
import {Switch, Route, BrowserRouter} from 'react-router-dom'


class App extends Component {
  //state = { modalShow: true };
  render() {
    //let modalClose = () => this.setState({ modalShow: false });
    return (
      <BrowserRouter>
      <Switch>
      <Route exact path='/'
              component={() =>  <CenterLogin/>}/>
      <Route path='/menuser' component={() => <Menuser/>} />
      <Route path='/menudriver' component={() => <Menudriver/>} />
      <Route path='*' component={Menuser} />
      </Switch>
    </BrowserRouter>
    );
  }
}

export default App;

/*
              <CenterLogin show={this.state.modalShow}
    onHide={modalClose}/>*/