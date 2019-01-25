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
    let gameData = {type: "gameType", data: game}
    this.socket.send(JSON.stringify(gameData));
  }

  componentDidMount() {
    // connects to Web Socket server
    this.socket = new WebSocket(
      'ws://localhost:3001'
    );

    // receives data from server
    this.socket.onmessage = (event) => {
      let serverData = JSON.parse(event.data);
      let gameID = serverData.gameID;
      let playerOne = serverData.playerOne;
      let playerTwo = serverData.playerTwo;

      this.setState({ gameID: gameID, 
                      playerOne: playerOne, 
                      playerTwo: playerTwo });
      // console.log(this.state)
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
      <Form selectGame={this.selectGame} gameID={this.state.gameID} playerOne={this.state.playerOne} playerTwo={this.state.playerTwo}/>
      </div>
    );
  }
}
export default App;
