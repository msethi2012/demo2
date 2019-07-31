import React, { Component } from 'react';
import './App.css';
import { Query } from 'react-apollo'
import Search from './search'

class App extends Component {
  render() {
    return (
      <div className="App">

        <Search />
      </div>
    );
  }
}

export default App;
