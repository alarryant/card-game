import React, {Component} from 'react';

import Header from './_header.jsx';

class App extends Component {
  constructor() {
    super();
    // websocket setup
    const socketServerURL = 'ws://localhost:3001'
    this.socket = new WebSocket(socketServerURL);
  }
  

  componentDidMount() {
    // websocket connection to server
    this.socket.onopen = () => {
      console.log('Connected to Server');
    };
  }

  render() {
    return (
      <div>
        <Header/>
      </div>
    );
  }
}
export default App;
