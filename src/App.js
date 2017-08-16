import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Facepalm from './Facepalm'
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Facepalm</h2>
        </div>
        <Facepalm />
      </div>
    );
  }
}

export default App;
