import React, { Component } from 'react';
import './App.css';
import CenterLogin from './components/centerLogin'
import Menuser from './components/menuser';
import {Switch, Route, BrowserRouter} from 'react-router-dom'


class App extends Component {
  state = { modalShow: true };
  render() {
    let modalClose = () => this.setState({ modalShow: false });
    return (
      <BrowserRouter>
      <Switch>
      <Route path='/'
              component={() =>  <CenterLogin show={this.state.modalShow}
                                              onHide={modalClose}/>}/>
      <Route path='/Menuser' component={() => <Menuser/>} />
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