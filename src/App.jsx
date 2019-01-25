import React, {Component} from 'react';
import Form from './Form.jsx';

import Header from './_header.jsx';
import Login from './Login.jsx';
import Blackjack from './Blackjack.jsx';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {};
    this.selectGame = this.selectGame.bind(this);
    this.sendBlackjackHands = this.sendBlackjackHands.bind(this);
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
    this.setState({gameType: game});
    this.socket.send(JSON.stringify(gameData));
  }

  sendBlackjackHands = hands => {
    let handData = {type: "blackjackHand", data: hands}
    this.socket.send(JSON.stringify(handData));
  }

  componentDidMount() {
    // connects to Web Socket server
    this.socket = new WebSocket(
      'ws://localhost:3001'
    );

    // receives data from server
    this.socket.onmessage = (event) => {
      let parsedData = JSON.parse(event.data);
      if (parsedData.type === "currentDeck") {
        this.setState({currentDeck: parsedData.data});
      } else if (parsedData.type === "blackjackHand") {
        this.setState({currentDeck: parsedData.data.currentDeck, player1Hand: parsedData.data.player1Hand, player2Hand: parsedData.data.player2Hand});
      }
    };
  }
  render() {
    return (
      <div>
        <Header />
        <Login loginInfo = {this.loginInfo} />
        <Form selectGame={this.selectGame} />
        {this.state.gameType === "blackjack" ? <Blackjack currentDeck={this.state.currentDeck} sendBlackjackHands={this.sendBlackjackHands} player1Hand={this.state.player1Hand} player2Hand={this.state.player2Hand}/> : ''}
      </div>
    );
  }
}
export default App;
