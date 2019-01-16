import React, {Component} from 'react';
import Form from './Form.jsx';

import Header from './_header.jsx';
import Login from './Login.jsx';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {loading: true};
    this.selectGame = this.selectGame.bind(this);
  }

  loginInfo = (email, password) => {
    const userLogin = {
      type: 'login',
      email: email,
      password: password
    }
    this.socket.send(JSON.stringify(userLogin));
  }

  selectGame = game => {
    this.socket.send(JSON.stringify(game));
  }

  componentDidMount() {
    // connects to Web Socket server
    this.socket = new WebSocket(
      'ws://localhost:3001'
    );

    // receives data from server
    this.socket.onmessage = (event) => {
      console.log(event.data);
    };

    // After 3 seconds, set `loading` to false in the state.
    setTimeout(() => {
      this.setState({ loading: false });
    }, 3000);
  }
  render() {
    return (
      <div>
      <Header />
      <Login loginInfo = {this.loginInfo} />
      <Form selectGame={this.selectGame} />
      </div>
    );
  }
}
export default App;
